import { ApplicationConfig } from "../../config/types"

export interface SpectacleMemoryStats {
  usedHeapSize?: number
  heapSizeLimit?: number
  totalHeapSize?: number
}

export interface VeeDriveStats {
  isConnected: boolean
  homeDirCount: number
}

export interface SpectacleStatusInformation {
  pageUrl: string
  startedAt: number
  uptime: number
  config: ApplicationConfig
  memory: SpectacleMemoryStats
  userAgent: string
  maxTouchPoints: number
  veeDrive: VeeDriveStats
}
