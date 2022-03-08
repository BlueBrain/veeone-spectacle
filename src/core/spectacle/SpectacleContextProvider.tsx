import React, { useMemo, useState } from "react"
import SpectacleContext, {
  SpectacleContextProps,
  ViewMode,
} from "./SpectacleContext"
import veeDriveService from "../../veedrive/service"
import { SceneId, SpectaclePresentation } from "../types"
import { useSelector } from "react-redux"
import SceneManager from "../scenes/SceneManager"

interface SpectacleContextProviderProps {}
const SpectacleContextProvider: React.FC<SpectacleContextProviderProps> = ({
  children,
}) => {
  const [saveModalVisible, setSaveModalVisible] = useState(false)
  const [loadModalVisible, setLoadModalVisible] = useState(false)

  const [
    loadPresentationModalPosition,
    setLoadPresentationModalPosition,
  ] = useState(null)

  const [
    savePresentationModalPosition,
    setSavePresentationModalPosition,
  ] = useState(null)

  const [viewMode, setViewMode] = useState(
    ViewMode.SceneOverview
    // ViewMode.Desk
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

  const sceneManager = useMemo(() => new SceneManager(), [])

  const providerValue: SpectacleContextProps = useMemo<SpectacleContextProps>(
    () => ({
      sceneManager,
      previousSceneId,
      nextSceneId,
      activeSceneId,
      savePresentationModal: {
        visible: saveModalVisible,
      },
      savePresentation: {
        isModalOpen: saveModalVisible,
        openModal: () => setSaveModalVisible(true),
        closeModal: (event, reason) => {
          if (reason === "backdropClick") {
            return
          }
          setSaveModalVisible(false)
        },
        save: async data => {
          const storeToSave = { ...presentationStore, ...data }
          console.debug("Saving presentation...", JSON.stringify(storeToSave))
          await veeDriveService.savePresentation(storeToSave)
        },
      },
      loadPresentationModalPosition,
      savePresentationModalPosition,
      loadPresentation: {
        isModalOpen: loadModalVisible,
        openModal: ({ position }) => {
          setLoadPresentationModalPosition(position)
          setLoadModalVisible(true)
        },
        closeModal: (event, reason) => {
          if (reason === "backdropClick") {
            return
          }
          setLoadModalVisible(false)
        },
        listPresentations: async () =>
          await veeDriveService.listPresentations(),
        load: async (presentationId: string) => {
          console.debug("Loading presentation...")
          return await veeDriveService.getPresentation(presentationId)
        },
      },
      viewMode,
      setViewMode,
    }),
    [
      loadModalVisible,
      loadPresentationModalPosition,
      presentationStore,
      saveModalVisible,
      savePresentationModalPosition,
      viewMode,
      setViewMode,
    ]
  )
  return (
    <SpectacleContext.Provider value={providerValue}>
      {children}
    </SpectacleContext.Provider>
  )
}

export default SpectacleContextProvider
