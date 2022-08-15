import React, { useCallback, useEffect, useMemo, useState } from "react"
import SpectacleContext, {
  SpectacleContextProps,
  ThumbnailRegistryItem,
  ViewMode,
} from "./SpectacleContext"
import { SceneId, SpectaclePresentation } from "../types"
import { useDispatch, useSelector } from "react-redux"
import SceneManager from "../scenes/SceneManager"
import { useConfig } from "../../config/AppConfigContext"
import VeeDriveService from "../../veedrive"
import useStatusUpdate from "../synec/use-status-update"

interface SpectacleContextProviderProps {}

const SpectacleContextProvider: React.FC<SpectacleContextProviderProps> = ({
  children,
}) => {
  const config = useConfig()
  const veeDriveService = useMemo(
    () => new VeeDriveService(config.VEEDRIVE_WS_PATH),
    [config]
  )
  const dispatch = useDispatch()

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

  const [isSaveModalVisible, setIsSaveModalVisible] = useState(false)
  const [isOpenModalVisible, setIsOpenModalVisible] = useState(false)

  const [
    openPresentationModalPosition,
    setOpenPresentationModalPosition,
  ] = useState(null)

  const [
    savePresentationModalPosition,
    setSavePresentationModalPosition,
  ] = useState(null)

  const [viewMode, setViewMode] = useState(
    // ViewMode.SceneOverview
    ViewMode.Desk
  )

  const presentationStore: SpectaclePresentation = useSelector(
    store => store
  ) as SpectaclePresentation

  const sceneIds: SceneId[] = presentationStore.scenes.sceneOrder
  const activeSceneId: SceneId = presentationStore.scenes.activeScene
  const activeSceneIndex: number = useMemo(
    () => sceneIds.indexOf(activeSceneId),
    [activeSceneId, sceneIds]
  )
  const previousSceneId: SceneId = useMemo(
    () => sceneIds[activeSceneIndex > 0 ? activeSceneIndex - 1 : null],
    [activeSceneIndex, sceneIds]
  )
  const nextSceneId: SceneId = useMemo(
    () =>
      sceneIds[
        activeSceneIndex + 1 < sceneIds.length ? activeSceneIndex + 1 : null
      ],
    [activeSceneIndex, sceneIds]
  )

  const sceneManager = useMemo(() => new SceneManager(dispatch), [dispatch])

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

  const isPresentationClean = useMemo(
    () =>
      // Ignore empty presentation as if they were not modified
      (presentationStore.savedAt === null &&
        presentationStore.scenes.sceneOrder.length === 1 &&
        presentationStore.scenes.scenes[presentationStore.scenes.activeScene]
          .frameStack.length === 0) ||
      presentationStore.savedAt === presentationStore.updatedAt,
    [
      presentationStore.savedAt,
      presentationStore.scenes.activeScene,
      presentationStore.scenes.sceneOrder.length,
      presentationStore.scenes.scenes,
      presentationStore.updatedAt,
    ]
  )

  const providerValue: SpectacleContextProps = useMemo<SpectacleContextProps>(
    () => ({
      isPresentationClean,
      veeDriveService,
      sceneManager,
      previousSceneId,
      nextSceneId,
      activeSceneId,
      activeSceneIndex,
      sceneIds,
      viewMode,
      setViewMode,
      presentationStore,
      thumbnailRegistry,
      addThumbnailToRegistry,
    }),
    [
      isPresentationClean,
      veeDriveService,
      sceneManager,
      previousSceneId,
      nextSceneId,
      activeSceneId,
      activeSceneIndex,
      sceneIds,
      viewMode,
      presentationStore,
      thumbnailRegistry,
      addThumbnailToRegistry,
    ]
  )

  useStatusUpdate(config, veeDriveService)

  return (
    <SpectacleContext.Provider value={providerValue}>
      {children}
    </SpectacleContext.Provider>
  )
}

export default SpectacleContextProvider
