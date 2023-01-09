import { useCallback, useEffect, useMemo } from "react"
import { SpectacleMemoryStats, SpectacleStatusInformation } from "../types"
import { ApplicationConfig } from "../../config/types"
import VeeDriveService from "../../veedrive"
import { systemStats } from "../../spectacle/SpectacleScreen"
import VeeDriveHealthCheckService from "../../veedrive/vee-drive-health-check"

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
  const veeDriveHealthCheckService = useMemo(
    () => new VeeDriveHealthCheckService(config.VEEDRIVE_HEALTH_CHECK_WS_PATH),
    [config.VEEDRIVE_HEALTH_CHECK_WS_PATH]
  )

  const worker = useMemo(() => {
    console.info("SYNEC_CHECKIN_ENABLED", config.SYNEC_CHECKIN_ENABLED)
    if (!config.SYNEC_CHECKIN_ENABLED) {
      return null
    }
    console.info("Creating new worker for Synec check-in...")
    return new Worker(
      // @ts-ignore
      new URL("../workers/synec-check-in", import.meta.url)
    )
  }, [config.SYNEC_CHECKIN_ENABLED])

  const startedAt = useMemo(() => Date.now(), [])

  const gatherStatusInformation = useCallback(async () => {
    const reportedAt = Date.now()
    const uptime = reportedAt - startedAt
    const memory = getMemoryStats()

    // VeeDrive checks
    const dirList = await veeDriveService.listDirectory({ path: "" })
    const homeDirCount = dirList.directories.length
    const healthCheckResponse = await veeDriveHealthCheckService.checkHealth()
    const filesystemOk = healthCheckResponse.fs_ok
    const databaseOk = healthCheckResponse.db_ok

    const clientId = config.CLIENT_ID
    const environment = config.RUNNING_ENVIRONMENT
    const lastUserActivityAt = systemStats.lastUserActivityAt

    // This data is sent to Synec as a check-in report
    const data: SpectacleStatusInformation = {
      clientId,
      environment,
      pageUrl: window.location.href,
      userAgent: window.navigator.userAgent,
      maxTouchPoints: window.navigator.maxTouchPoints,
      visibilityState: window.document.visibilityState,
      hasFocus: window.document.hasFocus(),
      memory,
      startedAt,
      reportedAt,
      uptime,
      config,
      veeDrive: {
        isConnected: veeDriveService.isConnected(),
        homeDirCount,
        filesystemOk,
        databaseOk,
      },
      lastUserActivityAt,
    }
    return data
  }, [config, startedAt, veeDriveService])

  const postMessageToSynecWorker = useCallback(async () => {
    const payload = await gatherStatusInformation()
    worker?.postMessage({ method: "statusUpdate", payload })
  }, [gatherStatusInformation, worker])

  useEffect(() => {
    worker?.addEventListener(
      "message",
      (message: MessageEvent) => {
        console.debug("Received a message from the worker", message.data)
        if (message.data.method === "ready") {
          void postMessageToSynecWorker()
        }
      },
      { once: true }
    )
  }, [config.SYNEC_CHECKIN_WS_PATH, postMessageToSynecWorker, worker])

  useEffect(() => {
    console.info("Initialize worker for Synec check-in...")

    worker?.postMessage({
      method: "initialize",
      payload: {
        checkInWebSocketPath: config.SYNEC_CHECKIN_WS_PATH,
      },
    })
  }, [config.SYNEC_CHECKIN_WS_PATH, worker])

  useEffect(() => {
    if (!config.SYNEC_CHECKIN_ENABLED) {
      return
    }

    console.debug("Set up new interval to Synec...")
    const interval = setInterval(
      postMessageToSynecWorker,
      config.SYNEC_STATUS_UPDATE_INTERVAL_MS
    )

    return () => {
      console.debug("Cleaning up interval...")
      clearInterval(interval)
    }
  }, [
    config.SYNEC_CHECKIN_ENABLED,
    config.SYNEC_STATUS_UPDATE_INTERVAL_MS,
    postMessageToSynecWorker,
    worker,
  ])
}

export default useStatusUpdate
