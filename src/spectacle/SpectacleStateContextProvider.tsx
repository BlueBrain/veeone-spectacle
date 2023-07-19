import React, { useCallback, useEffect, useMemo, useRef, useState } from "react"
import SpectacleStateContext, {
  SpectacleStateContextProps,
  ThumbnailRegistryItem,
  ViewMode,
} from "./SpectacleStateContext"
import { useConfig } from "../config/AppConfigContext"
import VeeDriveService from "../veedrive"
import useStatusUpdate from "../synec/hooks/use-status-update"
import { ResizePresentationPayload } from "./types"
import { getFreshPresentation } from "../presentations/fresh-presentation"
import { resizePresentationStore } from "../presentations/resizing"
import usePresentationStateManager from "./hooks/use-presentation-state-manager"
import useFrameManager from "./hooks/use-frame-manager"
import * as Sentry from "@sentry/browser"

interface SpectacleContextProviderProps {}

const SpectacleStateContextProvider: React.FC<SpectacleContextProviderProps> = ({
  children,
}) => {
  const config = useConfig()

  const deskRef = useRef<HTMLDivElement>(null)

  const [viewZoomPercent, setViewZoomPercent] = useState(100)

  const [targetEnvironment, setTargetEnvironment] = useState(null)

  const freshPresentation = useMemo(() => {
    return getFreshPresentation({ config, defaultStore: { targetEnvironment } })
  }, [config, targetEnvironment])

  const veeDriveService = useMemo(
    () => new VeeDriveService(config.VEEDRIVE_WS_PATH),
    [config]
  )

  // This hook is for sending reports to Synec about the status/health of the app
  useStatusUpdate(config, veeDriveService)

  const {
    presentationStore,
    setPresentationStore,
    loadPresentationStore,
    markMutatedState,
    isPresentationClean,
    savePresentationStore,
  } = usePresentationStateManager({ freshPresentation })

  useEffect(() => {
    if (presentationStore.targetEnvironment) {
      setTargetEnvironment(presentationStore.targetEnvironment)
    }
  }, [presentationStore.targetEnvironment])

  const {
    addFrame,
    manipulateFrame,
    updateFrameData,
    bringFrameToFront,
    sendFrameToBack,
    deactivateAllFrames,
    closeFrame,
    closeAllFrames,
  } = useFrameManager({ setPresentationStore, markMutatedState })

  const [thumbnailRegistry, setThumbnailRegistry] = useState<{
    [key: string]: ThumbnailRegistryItem
  }>({})

  useEffect(() => {
    async function connectToVeeDrive() {
      await veeDriveService.connect()
    }
    void connectToVeeDrive()
  }, [veeDriveService])

  const [viewMode, setViewMode] = useState(
    // ViewMode.SceneOverview
    ViewMode.Desk
  )

  const [browserOfflineSince, setBrowserOfflineSince] = useState<number | null>(
    null
  )

  const addThumbnailToRegistry = useCallback(
    (path: string, thumbnail: ThumbnailRegistryItem) => {
      setThumbnailRegistry(oldState => ({
        [path]: thumbnail,
        ...oldState,
      }))
    },
    []
  )

  const resizePresentation = useCallback(
    (payload: ResizePresentationPayload) => {
      setPresentationStore(state => {
        return resizePresentationStore(
          state,
          payload.newSize,
          config.MINIMUM_FRAME_LONG_SIDE,
          config.MAXIMUM_FRAME_LONG_SIDE,
          {
            width: config.FILE_BROWSER_WIDTH,
            height: config.FILE_BROWSER_HEIGHT,
          }
        )
      })
      markMutatedState()
    },
    [
      config.FILE_BROWSER_HEIGHT,
      config.FILE_BROWSER_WIDTH,
      config.MAXIMUM_FRAME_LONG_SIDE,
      config.MINIMUM_FRAME_LONG_SIDE,
      markMutatedState,
      setPresentationStore,
    ]
  )

  const updatePresentationStore = useCallback(
    callback => {
      setPresentationStore(state => callback(state))
    },
    [setPresentationStore]
  )

  const presentationName = useMemo(() => presentationStore.name, [
    presentationStore.name,
  ])

  useEffect(() => {
    function handleGoingOffline() {
      setBrowserOfflineSince(Date.now())
    }

    function handleGoingOnline() {
      const now = new Date()
      const nowTimestamp = Date.now()
      const wasOfflineForSeconds = (nowTimestamp - browserOfflineSince) / 1000
      const offlineSince = new Date(browserOfflineSince)
      setBrowserOfflineSince(null)
      Sentry.captureMessage(
        `Spectacle was offline for ${wasOfflineForSeconds} second(s). 
Went offline from ${offlineSince.toISOString()} to ${now.toISOString()}`
      )
    }

    window.addEventListener("offline", handleGoingOffline)
    window.addEventListener("online", handleGoingOnline)

    return () => {
      window.removeEventListener("offline", handleGoingOffline)
      window.removeEventListener("online", handleGoingOnline)
    }
  }, [browserOfflineSince])

  const isOnline = useMemo(() => browserOfflineSince === null, [
    browserOfflineSince,
  ])

  const providerValue: SpectacleStateContextProps = useMemo<SpectacleStateContextProps>(
    () => ({
      presentationName,
      isPresentationClean,
      isOnline,
      veeDriveService,
      viewMode,
      setViewMode,
      presentationStore,
      updatePresentationStore,
      thumbnailRegistry,
      addThumbnailToRegistry,
      addFrame,
      manipulateFrame,
      updateFrameData,
      bringFrameToFront,
      sendFrameToBack,
      deactivateAllFrames,
      closeFrame,
      closeAllFrames,
      loadPresentationStore,
      savePresentationStore,
      resizePresentation,
      viewZoomPercent,
      setViewZoomPercent,
      deskRef,
    }),
    [
      presentationName,
      isPresentationClean,
      isOnline,
      veeDriveService,
      viewMode,
      presentationStore,
      updatePresentationStore,
      thumbnailRegistry,
      addThumbnailToRegistry,
      addFrame,
      manipulateFrame,
      updateFrameData,
      bringFrameToFront,
      sendFrameToBack,
      deactivateAllFrames,
      closeFrame,
      loadPresentationStore,
      savePresentationStore,
      resizePresentation,
      closeAllFrames,
      viewZoomPercent,
      setViewZoomPercent,
      deskRef,
    ]
  )

  return (
    <SpectacleStateContext.Provider value={providerValue}>
      {children}
    </SpectacleStateContext.Provider>
  )
}

export default SpectacleStateContextProvider
