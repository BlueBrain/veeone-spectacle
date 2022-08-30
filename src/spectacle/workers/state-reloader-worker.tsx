import {
  UpdateStoreParams,
  SpectacleWorkerMethod,
  WorkerToSpectacleMethod,
  ReceiveLatestStore,
} from "./methods"
import _ from "lodash"
import { SpectaclePresentation } from "../../types"

const DB_NAME = "spectacle"

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
      // @ts-ignore
      const db = event.target.result as IDBDatabase
      const objectStore = db.createObjectStore(StoreName.StateHistory)
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

    transaction.oncomplete = () => {
      console.debug("Transaction complete!")
    }

    transaction.onerror = () => {
      console.error("Error on transaction", transaction.error)
    }

    const objectStore = transaction.objectStore(StoreName.StateHistory)
    console.log("objectStore", objectStore)

    const request = objectStore.add(params.presentationStore, params.timestamp)
    request.onsuccess = event => {
      console.log("Entry written successfully", event)
    }
  }

  private fetchLatestStore = async (): Promise<SpectaclePresentation> => {
    return new Promise(resolve => {
      const transaction = this.db.transaction(
        [StoreName.StateHistory],
        "readwrite"
      )
      const objectStore = transaction.objectStore(StoreName.StateHistory)

      objectStore.openCursor(null, "prev").onsuccess = event => {
        // @ts-ignore
        const cursor = event.target.result as IDBCursorWithValue
        console.log("RESULT", cursor)
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
}

const worker = new StateReloaderWorker()

onmessage = worker.onmessage
