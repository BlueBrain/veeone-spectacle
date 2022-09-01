import { SpectaclePresentation } from "../../types"

export enum SpectacleWorkerMethod {
  Initialize,
  UpdateStore,
  GetLatestStore,
}

export enum WorkerToSpectacleMethod {
  ProvideLatestStore,
}

export interface ReceiveLatestStore {
  timestamp: number
  presentationStore: SpectaclePresentation
}

export interface UpdateStoreParams {
  timestamp: number
  presentationStore: SpectaclePresentation
}

export interface InitializeParams {
  dbName?: string
  storeStateKeepMaxCount?: number
  infiniteReloadProtectionPeriodSeconds?: number
  infiniteReloadProtectionMaxAttempts?: number
}
