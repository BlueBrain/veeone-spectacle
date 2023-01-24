import {
  UpdateStoreParams,
  SpectacleWorkerMethod,
  WorkerToSpectacleMethod,
  ReceiveLatestStore,
  InitializeParams,
} from "./methods"
import _ from "lodash"
import { SpectaclePresentation } from "../../types"

enum StoreName {
  StateHistory = "StateHistory",
  LatestStoreReloads = "LatestStoreReloads",
}

class StateReloaderWorker {
  dbName = "spectacle"
  storeStateKeepMaxCount = 100
  infiniteReloadProtectionPeriodSeconds = 60
  infiniteReloadProtectionMaxAttempts = 5
  DATABASE_VERSION = 1
  DBOpenRequest: IDBOpenDBRequest
  db: IDBDatabase
  isReady = false

  constructor() {}

  private initialize = async (params: InitializeParams) => {
    if (this.isReady) {
      return
    }

    if (typeof params.dbName !== "undefined") {
      this.dbName = params.dbName
    }

    if (typeof params.infiniteReloadProtectionMaxAttempts !== "undefined") {
      this.infiniteReloadProtectionMaxAttempts =
        params.infiniteReloadProtectionMaxAttempts
    }

    if (typeof params.infiniteReloadProtectionPeriodSeconds !== "undefined") {
      this.infiniteReloadProtectionPeriodSeconds =
        params.infiniteReloadProtectionPeriodSeconds
    }

    if (typeof params.storeStateKeepMaxCount !== "undefined") {
      this.storeStateKeepMaxCount = params.storeStateKeepMaxCount
    }

    await this.connectToDatabase()
  }

  onmessage = async (message: MessageEvent) => {
    if (
      !this.isReady &&
      message.data.method === SpectacleWorkerMethod.Initialize
    ) {
      const params = message.data.params as InitializeParams
      await this.initialize(params)
    }

    if (!this.isReady) {
      setTimeout(() => this.onmessage(message), 100)
      return
    }

    switch (message.data.method) {
      case SpectacleWorkerMethod.UpdateStore: {
        const params = message.data.params as UpdateStoreParams
        await this.addNewStoreItem(params)
        break
      }
      case SpectacleWorkerMethod.GetLatestStore: {
        await this.sendLatestStoreToFrontend()
        break
      }
      default: {
      }
    }
  }

  private connectToDatabase = async () => {
    const availableDatabase = await indexedDB.databases()
    this.DBOpenRequest = indexedDB.open(this.dbName, this.DATABASE_VERSION)
    this.DBOpenRequest.onerror = event => {}

    this.DBOpenRequest.onsuccess = event => {
      this.db = this.DBOpenRequest.result
      this.isReady = true
    }

    this.DBOpenRequest.onupgradeneeded = (event: IDBVersionChangeEvent) => {
      const target = event.target as IDBRequest
      const db = target.result as IDBDatabase
      db.createObjectStore(StoreName.StateHistory)
      db.createObjectStore(StoreName.LatestStoreReloads)
    }
  }

  private addNewStoreItem = async (params: UpdateStoreParams) => {
    const latestStore = await this.fetchLatestStore()
    if (_.isEqual(params.presentationStore, latestStore)) {
      return
    }
    const transaction = this.db.transaction(
      [StoreName.StateHistory],
      "readwrite"
    )

    const objectStore = transaction.objectStore(StoreName.StateHistory)

    const request = objectStore.add(params.presentationStore, params.timestamp)
    request.onsuccess = event => {}

    await this.removeOldStoreStates()
  }

  private fetchLatestStore = async (): Promise<SpectaclePresentation> => {
    return new Promise(resolve => {
      const transaction = this.db.transaction(
        [StoreName.StateHistory],
        "readwrite"
      )
      const objectStore = transaction.objectStore(StoreName.StateHistory)

      objectStore.openCursor(null, "prev").onsuccess = event => {
        const target = event.target as IDBRequest
        const cursor = target.result as IDBCursorWithValue
        if (cursor) {
          resolve({ ...cursor.value })
        } else {
          resolve(null)
        }
      }
    })
  }

  private incrementLatestStoreSenderCounter = async () => {
    return new Promise(resolve => {
      const transaction = this.db.transaction(
        StoreName.LatestStoreReloads,
        "readwrite"
      )
      const objectStore = transaction.objectStore(StoreName.LatestStoreReloads)
      const now = Date.now()
      const request = objectStore.add(now, now)
      request.onsuccess = () => {
        resolve(null)
      }
    })
  }

  private getLatestStoreRetrievalCount = async () => {
    return new Promise(resolve => {
      const transaction = this.db.transaction(
        [StoreName.LatestStoreReloads],
        "readonly"
      )
      const now = Date.now()
      const oldestReload =
        now - this.infiniteReloadProtectionPeriodSeconds * 1000
      const query = IDBKeyRange.bound(oldestReload, now)
      const request = transaction
        .objectStore(StoreName.LatestStoreReloads)
        .count(query)
      request.onsuccess = event => {
        const target = event.target as IDBRequest
        resolve(target.result)
      }
    })
  }

  private resetStateHistory = async () => {
    const transaction = this.db.transaction(
      [StoreName.LatestStoreReloads, StoreName.StateHistory],
      "readwrite"
    )
    transaction.objectStore(StoreName.LatestStoreReloads).clear()
    transaction.objectStore(StoreName.StateHistory).clear()
  }

  private sendLatestStoreToFrontend = async () => {
    const presentationStore: SpectaclePresentation = await this.fetchLatestStore()
    const params: ReceiveLatestStore = {
      presentationStore,
      timestamp: 0,
    }

    await this.incrementLatestStoreSenderCounter()
    const retrievalCount = await this.getLatestStoreRetrievalCount()

    if (retrievalCount <= this.infiniteReloadProtectionMaxAttempts) {
      postMessage({
        method: WorkerToSpectacleMethod.ProvideLatestStore,
        params,
      })
    } else {
      await this.resetStateHistory()
    }
  }

  private removeOldStoreStates = async () => {
    const deleteCountedItems = event => {
      const target = event.target as IDBRequest
      const itemsToDelete = target.result - this.storeStateKeepMaxCount
      let itemsDeleted = 0

      if (itemsToDelete > 0) {
        objectStore.openCursor(null, "next").onsuccess = event => {
          const target = event.target as IDBRequest
          const cursor = target.result as IDBCursorWithValue
          if (cursor && itemsToDelete > itemsDeleted) {
            cursor.delete().onsuccess = () => {
              itemsDeleted++
            }
            cursor.continue()
          }
        }
      }
    }
    const transaction = this.db.transaction(
      [StoreName.StateHistory],
      "readwrite"
    )
    const objectStore = transaction.objectStore(StoreName.StateHistory)
    const count = objectStore.count()
    count.onsuccess = deleteCountedItems
  }
}

const worker = new StateReloaderWorker()

onmessage = worker.onmessage
