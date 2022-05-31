import { useCallback, useEffect, useMemo } from "react"
import { SpectacleMemoryStats, SpectacleStatusInformation } from "./types"
import { ApplicationConfig } from "../../config/types"
import VeeDriveService from "../../veedrive"

const getMemoryStats = (): SpectacleMemoryStats => ({
  // @ts-ignore
  totalHeapSize: window.performance?.memory?.totalJSHeapSize,
  // @ts-ignore
  heapSizeLimit: window.performance?.memory?.jsHeapSizeLimit,
  // @ts-ignore
  usedHeapSize: window.performance?.memory?.usedJSHeapSize,
})

const useStatusUpdate = (
  config: ApplicationConfig,
  veeDriveService: VeeDriveService
) => {
  useEffect(() => {
    console.info("New worker for Synec check-in...")
    const startedAt = Date.now()

    const worker = new Worker(
      // @ts-ignore
      new URL("../synec/workers/synec-check-in", import.meta.url)
    )

    const gatherStatusInformation = async () => {
      const reportedAt = Date.now()
      const uptime = reportedAt - startedAt
      const memory = getMemoryStats()
      const dirList = await veeDriveService.listDirectory({ path: "" })
      const homeDirCount = dirList.directories.length
      const clientId = config.CLIENT_ID
      const environment = config.RUNNING_ENVIRONMENT
      const data: SpectacleStatusInformation = {
        clientId,
        environment,
        pageUrl: window.location.href,
        userAgent: window.navigator.userAgent,
        maxTouchPoints: window.navigator.maxTouchPoints,
        memory,
        startedAt,
        reportedAt,
        uptime,
        config,
        veeDrive: {
          isConnected: veeDriveService.isConnected(),
          homeDirCount,
        },
      }
      return data
    }

    const postMessageToSynecWorker = async () => {
      const payload = await gatherStatusInformation()
      worker.postMessage({ method: "statusUpdate", payload })
    }

    worker.postMessage({
      method: "initialize",
      payload: {
        checkInWebSocketPath: config.SYNEC_CHECKIN_WS_PATH,
      },
    })

    worker.addEventListener(
      "message",
      (message: MessageEvent) => {
        console.debug("Received a message from the worker", message.data)
        if (message.data.method === "ready") {
          void postMessageToSynecWorker()
        }
      },
      { once: true }
    )

    const interval = setInterval(
      () => void postMessageToSynecWorker(),
      config.SYNEC_STATUS_UPDATE_INTERVAL_MS
    )

    return () => {
      console.debug("Cleaning up useStatusUpdate...")
      clearInterval(interval)
      worker.terminate()
    }
  }, [config, veeDriveService])
}

export default useStatusUpdate
