import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  TextField,
} from "@mui/material"
import React, { useCallback, useEffect, useRef, useState } from "react"
import { useSpectacle } from "../core/spectacle/SpectacleContext"
import { visualKeyboardService } from "../visualkeyboard"
import { SpectaclePresentation } from "../core/types"
import { generateRandomPresentationId } from "../core/presentations/utils"

interface SavePresentationModalProps {}

const keyboardId = "savePresentationName"

const SavePresentationModal: React.FC<SavePresentationModalProps> = () => {
  const presentationNameFieldRef = useRef()
  const spectacleContext = useSpectacle()
  const { left, top } = spectacleContext.savePresentationModalPosition
  const [presentationTitle, setPresentationTitle] = useState(
    spectacleContext.presentationStore.name
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

  const savePresentation = useCallback(
    (extraData: Partial<SpectaclePresentation> = {}) => {
      const now = Date.now()
      spectacleContext.savePresentation.save({
        name: presentationTitle,
        savedAt: now,
        updatedAt: now,
        ...extraData,
      })
    },
    [presentationTitle, spectacleContext.savePresentation]
  )

  const handleSaveClick = event => {
    savePresentation()
    spectacleContext.savePresentation.closeModal(event, "saved")
  }

  const handleSaveAsNewClick = event => {
    savePresentation({ id: generateRandomPresentationId() })
    spectacleContext.savePresentation.closeModal(event, "saved")
  }

  const handleTextInputChange = event => {
    const value = event.target.value
    setPresentationTitle(value)
    visualKeyboardService.updateKeyboardState(keyboardId, value)
  }

  return (
    <Dialog
      open={spectacleContext.savePresentation.isModalOpen}
      onClose={spectacleContext.savePresentation.closeModal}
      fullWidth={true}
      PaperProps={{
        sx: {
          position: "absolute",
          transform: "translate(-50%, -50%)",
          left,
          top,
        },
      }}
    >
      <DialogTitle>Save presentation</DialogTitle>
      <DialogContent>
        <Grid container alignItems={"center"} sx={{ py: 3 }}>
          <Grid item xs sx={{ paddingBottom: "15rem" }}>
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
        <Button
          onClick={event =>
            spectacleContext.savePresentation.closeModal(event, "cancel")
          }
        >
          Cancel
        </Button>
        <Button onClick={handleSaveAsNewClick}>Save as new</Button>
        <Button onClick={handleSaveClick} variant={"contained"}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default SavePresentationModal
