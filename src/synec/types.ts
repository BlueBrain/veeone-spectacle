import { ApplicationConfig } from "../config/types"

export interface SpectacleMemoryStats {
  usedHeapSize?: number
  heapSizeLimit?: number
  totalHeapSize?: number
}

export interface VeeDriveStats {
  isConnected: boolean
  homeDirCount: number
  filesystemOk: boolean
  databaseOk: boolean
}

export interface SpectacleStatusInformation {
  clientId: string
  environment: string
  pageUrl: string
  startedAt: number
  reportedAt: number
  uptime: number
  config: ApplicationConfig
  memory: SpectacleMemoryStats
  userAgent: string
  maxTouchPoints: number
  veeDrive: VeeDriveStats
  visibilityState: VisibilityState
  hasFocus: boolean
  lastUserActivityAt: number | null
}
