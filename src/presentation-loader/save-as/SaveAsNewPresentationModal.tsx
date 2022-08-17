import {
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  TextField,
} from "@mui/material"
import React, { useCallback, useEffect, useRef, useState } from "react"
import { useSpectacle } from "../../core/spectacle/SpectacleContext"
import { visualKeyboardService } from "../../visualkeyboard"
import { BaseDialog } from "../../dialogs/DialogsContext"
import { generateRandomPresentationId } from "../../core/presentations/utils"
import PresentationFolderList from "./PresentationFolderList"

const keyboardId = "savePresentationName"

const SaveAsNewPresentationModal: React.FC<BaseDialog> = ({
  position,
  resolveDialog,
  cancelDialog,
}) => {
  const presentationNameFieldRef = useRef()
  const spectacleContext = useSpectacle()
  const { left, top } = position
  const [presentationTitle, setPresentationTitle] = useState(
    spectacleContext.presentationStore.name !== "Untitled"
      ? spectacleContext.presentationStore.name
      : ""
  )

  const showVisualKeyboard = useCallback((target, initialValue: string) => {
    visualKeyboardService.newKeyboard(
      target,
      newValue => setPresentationTitle(newValue),
      {
        initialValue,
        keyboardId,
      }
    )
  }, [])

  useEffect(() => {
    return () => {
      visualKeyboardService.closeKeyboard(keyboardId)
    }
  }, [])

  const handleSaveClick = async event => {
    resolveDialog({
      presentationId: generateRandomPresentationId(),
      presentationName: presentationTitle,
    })
  }

  const handleTextInputChange = event => {
    const value = event.target.value
    setPresentationTitle(value)
    visualKeyboardService.updateKeyboardState(keyboardId, value)
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
