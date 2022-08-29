import {
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  TextField,
} from "@mui/material"
import React, { useCallback, useEffect, useRef, useState } from "react"
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
  const { presentationStore } = useSpectacle()
  const { openKeyboard, closeKeyboardById } = useVisualKeyboard()
  const [presentationName, setPresentationName] = useState(
    presentationStore.name !== "Untitled" ? presentationStore.name : ""
  )
  const [folderName, setFolderName] = useState(null)

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

  useEffect(() => {
    return () => {
      closeKeyboardById(keyboardId)
    }
  }, [closeKeyboardById])

  const handleSaveClick = async () => {
    const presentationId = generateRandomPresentationId()
    resolveDialog({
      presentationId,
      presentationName,
      folderName,
    } as SaveAsNewPresentationModalResponse)
  }

  const handleTextInputChange = event => {
    const value = event.target.value
    setPresentationName(value)
  }

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
        <Button onClick={cancelDialog}>Cancel</Button>
        <Button onClick={handleSaveClick} variant={"contained"}>
          Save
        </Button>
      </DialogActions>
    </>
  )
}

export default SaveAsNewPresentationModal
