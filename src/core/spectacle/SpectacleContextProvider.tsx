import React, { useMemo, useState } from "react"
import SpectacleContext, { SpectacleContextProps } from "./SpectacleContext"
import veeDriveService from "../../veedrive/service"
import { SpectaclePresentation } from "../types"
import { useSelector } from "react-redux"
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
  const presentationStore: SpectaclePresentation = useSelector(
    store => store
  ) as SpectaclePresentation

  const providerValue: SpectacleContextProps = useMemo<SpectacleContextProps>(
    () => ({
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
    }),
    [
      loadModalVisible,
      loadPresentationModalPosition,
      presentationStore,
      saveModalVisible,
      savePresentationModalPosition,
    ]
  )
  return (
    <SpectacleContext.Provider value={providerValue}>
      {children}
    </SpectacleContext.Provider>
  )
}

export default SpectacleContextProvider
