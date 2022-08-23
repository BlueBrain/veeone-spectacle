import {
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  TextField,
} from "@mui/material"
import React, { useCallback, useEffect, useRef, useState } from "react"
import { useSpectacle } from "../../../spectacle/SpectacleContext"
import { generateRandomPresentationId } from "../../utils"
import PresentationFolderList from "./PresentationFolderList"
import { useActiveDialog } from "../../../dialogs/ActiveDialogContext"
import { useVisualKeyboard } from "../../../visualkeyboard/VisualKeyboardContext"

const SaveAsNewPresentationModal: React.FC = () => {
  const keyboardId = "savePresentationName"
  const { resolveDialog, cancelDialog } = useActiveDialog()
  const presentationNameFieldRef = useRef()
  const { presentationStore } = useSpectacle()
  const { openKeyboard, closeKeyboard } = useVisualKeyboard()
  const [presentationTitle, setPresentationTitle] = useState(
    presentationStore.name !== "Untitled" ? presentationStore.name : ""
  )

  const showVisualKeyboard = useCallback(
    (target, initialValue: string) => {
      openKeyboard({
        target,
        onInputChange: newValue => setPresentationTitle(newValue),
        initial: initialValue,
        customKeyboardId: keyboardId,
      })
    },
    [openKeyboard]
  )

  useEffect(() => {
    return () => {
      closeKeyboard(keyboardId)
    }
  }, [closeKeyboard])

  const handleSaveClick = async () => {
    resolveDialog({
      presentationId: generateRandomPresentationId(),
      presentationName: presentationTitle,
    })
  }

  const handleTextInputChange = event => {
    const value = event.target.value
    setPresentationTitle(value)
  }

  return (
    <>
      <DialogTitle>Save presentation as&hellip;</DialogTitle>
      <DialogContent>
        <Grid container alignItems={"start"}>
          <Grid item xs md={4}>
            <PresentationFolderList />
          </Grid>
          <Grid item xs md={8} sx={{ padding: `.5rem 0 15rem 0` }}>
            <TextField
              inputRef={presentationNameFieldRef}
              type={"text"}
              variant={"outlined"}
              label={"Name of your presentation"}
              autoFocus={true}
              fullWidth={true}
              value={presentationTitle}
              onChange={handleTextInputChange}
              onFocus={event =>
                showVisualKeyboard(event.target, presentationTitle)
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
