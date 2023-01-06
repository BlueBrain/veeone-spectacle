import {
  Alert,
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  TextField,
} from "@mui/material"
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { useSpectacle } from "../../../spectacle/SpectacleStateContext"
import { generateRandomPresentationId } from "../../utils"
import PresentationFolderList from "./PresentationFolderList"
import { useActiveDialog } from "../../../dialogs/ActiveDialogContext"
import { useVisualKeyboard } from "../../../visualkeyboard/VisualKeyboardContext"

export interface SaveAsNewPresentationModalResponse {
  presentationId: string
  presentationName: string
  folderName: string
}

const SaveAsNewPresentationModal: React.FC = () => {
  const keyboardId = "savePresentationName"
  const { resolveDialog, cancelDialog } = useActiveDialog()
  const presentationNameFieldRef = useRef()
  const { presentationStore, veeDriveService } = useSpectacle()
  const { openKeyboard, closeKeyboardById } = useVisualKeyboard()
  const [presentationName, setPresentationName] = useState(
    presentationStore.name !== "Untitled" ? presentationStore.name : ""
  )
  const [folderName, setFolderName] = useState(null)
  const [isNameAvailable, setIsNameAvailable] = useState<boolean | null>(null)

  const showVisualKeyboard = useCallback(
    (target, initialValue: string) => {
      openKeyboard({
        target,
        onInputChange: newValue => setPresentationName(newValue),
        initial: initialValue,
        customKeyboardId: keyboardId,
      })
    },
    [openKeyboard]
  )

  const checkPresentationNameExistsInFolder = useCallback(async (): Promise<boolean> => {
    const response = await veeDriveService.listPresentations(folderName)
    const existingNames = response.results.map(value => value.name)
    return existingNames.includes(presentationName)
  }, [folderName, presentationName, veeDriveService])

  useEffect(() => {
    return () => {
      closeKeyboardById(keyboardId)
    }
  }, [closeKeyboardById])

  const handleSaveClick = useCallback(async () => {
    const presentationId = generateRandomPresentationId()
    const nameExists = await checkPresentationNameExistsInFolder()
    if (!nameExists) {
      resolveDialog({
        presentationId,
        presentationName,
        folderName,
      } as SaveAsNewPresentationModalResponse)
    }
  }, [
    checkPresentationNameExistsInFolder,
    folderName,
    presentationName,
    resolveDialog,
  ])

  const handleTextInputChange = event => {
    const value = event.target.value
    setPresentationName(value)
  }

  useEffect(() => {
    async function checkAvailability() {
      const nameExists = await checkPresentationNameExistsInFolder()
      setIsNameAvailable(!nameExists)
    }
    void checkAvailability()
  }, [
    veeDriveService,
    folderName,
    presentationName,
    checkPresentationNameExistsInFolder,
  ])

  const dialogButtons = useMemo(
    () => (
      <>
        <Button onClick={cancelDialog}>Cancel</Button>
        <Button
          onClick={handleSaveClick}
          variant={"contained"}
          disabled={!isNameAvailable || !presentationName}
        >
          Save
        </Button>
      </>
    ),
    [cancelDialog, handleSaveClick, isNameAvailable, presentationName]
  )

  return (
    <>
      <DialogTitle>Save presentation as&hellip;</DialogTitle>
      <DialogContent>
        <Grid container alignItems={"start"}>
          <Grid item xs md={4}>
            <PresentationFolderList
              selectedFolderName={folderName}
              onSelectFolder={setFolderName}
            />
          </Grid>
          <Grid item xs md={8} sx={{ padding: `.5rem 0 15rem 0` }}>
            <TextField
              inputRef={presentationNameFieldRef}
              error={!isNameAvailable}
              type={"text"}
              variant={"outlined"}
              label={"Name of your presentation"}
              autoFocus={true}
              fullWidth={true}
              value={presentationName}
              onChange={handleTextInputChange}
              onFocus={event =>
                showVisualKeyboard(event.target, presentationName)
              }
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        {!isNameAvailable ? (
          <Alert severity={"error"}>
            Presentation named `{presentationName}` already exists in `
            {folderName}.
          </Alert>
        ) : null}
        {!presentationName ? (
          <Alert severity={"error"}>Presentation name cannot be empty.</Alert>
        ) : null}
        {dialogButtons}
      </DialogActions>
    </>
  )
}

export default SaveAsNewPresentationModal
