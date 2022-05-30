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
  const startedAt = useMemo(() => Date.now(), [])

  const gatherStatusInformation = useCallback(async () => {
    const uptime = Date.now() - startedAt
    const memory = getMemoryStats()
    const dirList = await veeDriveService.listDirectory({ path: "" })
    const homeDirCount = dirList.directories.length
    const data: SpectacleStatusInformation = {
      pageUrl: window.location.href,
      userAgent: window.navigator.userAgent,
      maxTouchPoints: window.navigator.maxTouchPoints,
      memory,
      startedAt,
      uptime,
      config,
      veeDrive: {
        isConnected: veeDriveService.isConnected(),
        homeDirCount,
      },
    }
    return data
  }, [config, startedAt, veeDriveService])

  useEffect(() => {
    const worker = new Worker(
      // @ts-ignore
      new URL("../synec/workers/synec-check-in", import.meta.url)
    )

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

    worker.addEventListener("message", (message: MessageEvent) => {
      console.debug("Received a message from the worker", message.data)
      if (message.data.method === "ready") {
        void postMessageToSynecWorker()
      }
    })

    const interval = setInterval(
      postMessageToSynecWorker,
      config.SYNEC_STATUS_UPDATE_INTERVAL_MS
    )

    return () => {
      clearInterval(interval)
      worker.terminate()
    }
  }, [
    config.SYNEC_CHECKIN_WS_PATH,
    config.SYNEC_STATUS_UPDATE_INTERVAL_MS,
    gatherStatusInformation,
  ])
}

export default useStatusUpdate
