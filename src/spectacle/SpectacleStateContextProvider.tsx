import React, { useCallback, useEffect, useMemo, useState } from "react"
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
import { getConfig } from "../config"

interface SpectacleContextProviderProps {}

const globalVeeDriveService = new VeeDriveService(getConfig().VEEDRIVE_WS_PATH)

const SpectacleStateContextProvider: React.FC<SpectacleContextProviderProps> = ({
  children,
}) => {
  const config = useConfig()

  const freshPresentation = useMemo(() => getFreshPresentation({ config }), [
    config,
  ])

  const veeDriveService = useMemo(() => globalVeeDriveService, [])

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
      console.debug("Connecting to VeeDrive...")
      await veeDriveService.connect()
      console.info("VeeDrive connected.")
    }
    void connectToVeeDrive()
  }, [veeDriveService])

  const [viewMode, setViewMode] = useState(
    // ViewMode.SceneOverview
    ViewMode.Desk
  )

  const addThumbnailToRegistry = useCallback(
    (path: string, thumbnail: ThumbnailRegistryItem) => {
      console.debug("addThumbnailToRegistry called", path, thumbnail)
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
    ]
  )

  const updatePresentationStore = useCallback(callback => {
    setPresentationStore(state => callback(state))
  }, [])

  const presentationName = useMemo(() => presentationStore.name, [
    presentationStore.name,
  ])

  const providerValue: SpectacleStateContextProps = useMemo<SpectacleStateContextProps>(
    () => ({
      presentationName,
      isPresentationClean,
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
    }),
    [
      presentationName,
      isPresentationClean,
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
    ]
  )

  return (
    <SpectacleStateContext.Provider value={providerValue}>
      {children}
    </SpectacleStateContext.Provider>
  )
}

export default SpectacleStateContextProvider
