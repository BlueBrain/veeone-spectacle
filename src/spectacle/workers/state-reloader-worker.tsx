import {
  UpdateStoreParams,
  SpectacleWorkerMethod,
  WorkerToSpectacleMethod,
  ReceiveLatestStore,
} from "./methods"
import _ from "lodash"
import { SpectaclePresentation } from "../../types"

const DB_NAME = "spectacle"
const STORE_STATE_KEEP_MAX_COUNT = 100

enum StoreName {
  StateHistory = "StateHistory",
}

class StateReloaderWorker {
  DATABASE_VERSION = 1
  DBOpenRequest: IDBOpenDBRequest
  db: IDBDatabase
  isReady: boolean

  constructor() {
    this.isReady = false
    console.info("StateReloaderWorker initialized")
    void this.connectToDatabase()
  }

  onmessage = async (message: MessageEvent) => {
    if (!this.isReady) {
      console.log("Hold message because not yet initialized")
      setTimeout(() => this.onmessage(message), 1000)
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
        console.warn("Unhandled method", message.data)
      }
    }
  }

  private connectToDatabase = async () => {
    const availableDatabase = await indexedDB.databases()
    console.debug("availableDatabase", availableDatabase)
    this.DBOpenRequest = indexedDB.open(DB_NAME, this.DATABASE_VERSION)
    this.DBOpenRequest.onerror = event => {
      console.error("DBOpenRequest: Something went wrong")
    }

    this.DBOpenRequest.onsuccess = event => {
      this.db = this.DBOpenRequest.result
      this.isReady = true
      console.debug("Database initialized.", event, "db=", this.db)
    }

    this.DBOpenRequest.onupgradeneeded = (event: IDBVersionChangeEvent) => {
      const target = event.target as IDBRequest
      const db = target.result as IDBDatabase
      db.createObjectStore(StoreName.StateHistory)
    }
  }

  private addNewStoreItem = async (params: UpdateStoreParams) => {
    const latestStore = await this.fetchLatestStore()
    if (_.isEqual(params.presentationStore, latestStore)) {
      console.log("State is equal as the latest one. No update.")
      return
    }
    console.log("addNewStoreItem", params)
    const transaction = this.db.transaction(
      [StoreName.StateHistory],
      "readwrite"
    )

    const objectStore = transaction.objectStore(StoreName.StateHistory)
    console.log("objectStore", objectStore)

    const request = objectStore.add(params.presentationStore, params.timestamp)
    request.onsuccess = event => {
      console.log("Entry written successfully", event)
    }

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

  private sendLatestStoreToFrontend = async () => {
    const presentationStore: SpectaclePresentation = await this.fetchLatestStore()
    const params: ReceiveLatestStore = {
      presentationStore,
      timestamp: 0,
    }
    postMessage({
      method: WorkerToSpectacleMethod.ReceiveLatestStore,
      params,
    })
  }

  private removeOldStoreStates = async () => {
    const transaction = this.db.transaction(
      [StoreName.StateHistory],
      "readwrite"
    )
    const objectStore = transaction.objectStore(StoreName.StateHistory)
    const count = objectStore.count()
    count.onsuccess = event => {
      const target = event.target as IDBRequest
      const itemsToDelete = target.result - STORE_STATE_KEEP_MAX_COUNT
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
  }
}

const worker = new StateReloaderWorker()

onmessage = worker.onmessage
