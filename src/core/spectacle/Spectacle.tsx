import * as React from "react"
import { Desk } from "../desk"
import { styled, ThemeProvider } from "@mui/material/styles"
import { bbpTheme } from "../themes/bbp"
import { config } from "../../config"
import { SpectacleContext, SpectacleContextProps } from "./SpectacleContext"
import { useMemo, useState } from "react"
import SavePresentationModal from "../../presentation-loader/SavePresentationModal"
import { useSelector } from "react-redux"
import veeDriveService from "../../veedrive"
import { SpectaclePresentation } from "../types"
import LoadPresentationModal from "../../presentation-loader/LoadPresentationModal"

const StyledDeskWrapper = styled("div")({
  width: `${config.VIEWPORT_WIDTH}px`,
  height: `${config.VIEWPORT_HEIGHT}px`,
  overflow: "hidden",
  contain: `content`,
})

export const Spectacle = () => {
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

  if (!config.DISPLAY_MOUSE_CURSOR) {
    require("./hideCursor.scss")
  }

  const spectacleContext = useMemo<SpectacleContextProps>(
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
    <ThemeProvider theme={bbpTheme}>
      <SpectacleContext.Provider value={spectacleContext}>
        <StyledDeskWrapper>
          <Desk />
          {spectacleContext.savePresentation.isModalOpen ? (
            <SavePresentationModal />
          ) : null}
          {spectacleContext.loadPresentation.isModalOpen ? (
            <LoadPresentationModal />
          ) : null}
        </StyledDeskWrapper>
      </SpectacleContext.Provider>
    </ThemeProvider>
  )
}
