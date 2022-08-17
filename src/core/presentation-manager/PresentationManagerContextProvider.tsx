import React, { useCallback, useMemo } from "react"
import PresentationManagerContext, {
  PresentationManagerContextProps,
} from "./PresentationManagerContext"
import {
  SavePresentationOpenModalProps,
  useSpectacle,
} from "../spectacle/SpectacleContext"
import { SpectaclePresentation } from "../types"
import SaveAsNewPresentationModal from "../../presentation-loader/save-as/SaveAsNewPresentationModal"
import { loadPresentationStore, savePresentationStore } from "../redux/actions"
import { useDialogs } from "../../dialogs/DialogsContext"
import { useDispatch } from "react-redux"
import OpenPresentationModal from "../../presentation-loader/OpenPresentationModal"
import { resizePresentationStore } from "../presentations/resizing"
import { useConfig } from "../../config/AppConfigContext"
import { getFreshPresentation } from "../presentations/fresh-presentation"
import UnsavedChangesWarning from "../../presentation-loader/UnsavedChangesWarning"

const PresentationManagerContextProvider: React.FC = ({ children }) => {
  const dispatch = useDispatch()

  const config = useConfig()
  const dialogs = useDialogs()
  const {
    presentationStore,
    veeDriveService,
    isPresentationClean,
  } = useSpectacle()

  const performPresentationSave = useCallback(
    async (extraData: Partial<SpectaclePresentation> = {}) => {
      const now = Date.now()
      const timestampData: Partial<SpectaclePresentation> = {
        savedAt: now,
        updatedAt: now,
      }
      const storeToSave: SpectaclePresentation = {
        ...presentationStore,
        ...timestampData,
        ...extraData,
      }

      console.debug("Saving presentation...", JSON.stringify(storeToSave))
      dispatch(savePresentationStore(storeToSave))
      await veeDriveService.savePresentation(storeToSave)

      return storeToSave
    },
    [dispatch, presentationStore, veeDriveService]
  )

  const savePresentationAs = useCallback(
    async ({ position }) => {
      const {
        presentationName,
        presentationId,
      } = await dialogs.openDialog(SaveAsNewPresentationModal, { position })
      return await performPresentationSave({
        id: presentationId,
        name: presentationName,
      })
    },
    [dialogs, performPresentationSave]
  )

  const savePresentation = useCallback(
    async (args: SavePresentationOpenModalProps) => {
      if (!presentationStore.name) {
        // Open a "Save as" dialog if the presentation hasn't been saved yet
        return await savePresentationAs(args)
      } else {
        return await performPresentationSave()
      }
    },
    [performPresentationSave, presentationStore, savePresentationAs]
  )

  const openPresentation = useCallback(
    async ({ position }) => {
      const presentationId = await dialogs.openDialog(OpenPresentationModal, {
        position,
      })
      const store = await veeDriveService.getPresentation(presentationId)
      const sizeAdjustedPresentationStore = resizePresentationStore(
        store,
        {
          width: config.VIEWPORT_WIDTH,
          height: config.VIEWPORT_HEIGHT,
        },
        config.MINIMUM_FRAME_LONG_SIDE,
        config.MAXIMUM_FRAME_LONG_SIDE,
        {
          width: config.FILE_BROWSER_WIDTH,
          height: config.FILE_BROWSER_HEIGHT,
        }
      )
      dispatch(loadPresentationStore(sizeAdjustedPresentationStore))
      return sizeAdjustedPresentationStore
    },
    [config, dialogs, dispatch, veeDriveService]
  )

  const newPresentation = useCallback(
    async ({ position }) => {
      if (!isPresentationClean) {
        const result = await dialogs.openDialog(UnsavedChangesWarning, {
          position,
          maxWidth: "xs",
        })
        console.debug("NEW PRESENTATION RESULT", result)
      }
      const freshPresentation = getFreshPresentation({ config })
      dispatch(loadPresentationStore(freshPresentation))
      return freshPresentation
    },
    [config, dialogs, dispatch, isPresentationClean]
  )

  const providerValue = useMemo<PresentationManagerContextProps>(
    () => ({
      savePresentation,
      savePresentationAs,
      openPresentation,
      newPresentation,
    }),
    [newPresentation, openPresentation, savePresentation, savePresentationAs]
  )
  return (
    <PresentationManagerContext.Provider value={providerValue}>
      {children}
    </PresentationManagerContext.Provider>
  )
}

export default PresentationManagerContextProvider
