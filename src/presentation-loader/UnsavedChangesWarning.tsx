import ConfirmDialog from "../confirm-dialog/ConfirmDialog"
import React, { useCallback, useMemo } from "react"
import { usePresentationManager } from "../core/presentation-manager/PresentationManagerContext"
import { useSpectacle } from "../core/spectacle/SpectacleContext"
import { useActiveDialog } from "../dialogs/ActiveDialogContext"

const UnsavedChangesWarning: React.FC = () => {
  const presentationManager = usePresentationManager()
  const { presentationStore } = useSpectacle()
  const { dialogOptions, resolveDialog, cancelDialog } = useActiveDialog()

  const saveCurrentAndContinue = useCallback(
    async event => {
      await presentationManager.savePresentation({
        position: dialogOptions.position,
      })
      resolveDialog(true)
    },
    [presentationManager, dialogOptions.position, resolveDialog]
  )

  const dontSaveCurrentAndContinue = useCallback(
    event => {
      resolveDialog(false)
    },
    [resolveDialog]
  )

  const warningTitle = useMemo(
    () =>
      presentationStore.name
        ? `Save current changes?`
        : `Save new presentation?`,
    [presentationStore.name]
  )

  const warningText = useMemo(
    () =>
      presentationStore.name
        ? `You have unsaved changes in your current presentation. Do you want to save them first?`
        : `Your current presentation hasn't been saved yet. Do you want to save it before opening a new one?`,
    [presentationStore.name]
  )

  return (
    <ConfirmDialog
      position={dialogOptions.position}
      title={warningTitle}
      text={warningText}
      options={[
        {
          label: "No",
          action: dontSaveCurrentAndContinue,
          color: "warning",
          variant: "text",
        },
        { label: "Yes", action: saveCurrentAndContinue },
      ]}
      onCancel={() => cancelDialog(null)}
    />
  )
}

export default UnsavedChangesWarning
