import ConfirmDialog from "../../dialogs/confirm-dialog/ConfirmDialog"
import React, { useCallback, useMemo } from "react"
import { usePresentationManager } from "../presentation-manager/PresentationManagerContext"
import { useSpectacle } from "../../spectacle/SpectacleContext"
import { useActiveDialog } from "../../dialogs/ActiveDialogContext"

const UnsavedChangesWarning: React.FC = () => {
  const presentationManager = usePresentationManager()
  const { presentationStore } = useSpectacle()
  const { dialogOptions, resolveDialog, cancelDialog } = useActiveDialog()

  const saveCurrentAndContinue = useCallback(async () => {
    await presentationManager.savePresentation({
      position: dialogOptions.position,
    })
    resolveDialog(true)
  }, [presentationManager, dialogOptions.position, resolveDialog])

  const dontSaveCurrentAndContinue = useCallback(() => {
    resolveDialog(false)
  }, [resolveDialog])

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
