import { SpectaclePresentation } from "../../types"

export enum SpectacleWorkerMethod {
  UpdateStore,
  GetLatestStore,
}

export enum WorkerToSpectacleMethod {
  ReceiveLatestStore,
}

export interface ReceiveLatestStore {
  timestamp: number
  presentationStore: SpectaclePresentation
}

export interface UpdateStoreParams {
  timestamp: number
  presentationStore: SpectaclePresentation
}
