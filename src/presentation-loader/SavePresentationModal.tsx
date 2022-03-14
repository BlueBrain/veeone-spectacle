import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  TextField,
} from "@mui/material"
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react"
import SpectacleContext, {
  useSpectacle,
} from "../core/spectacle/SpectacleContext"
import { visualKeyboardService } from "../visualkeyboard"
import { SpectaclePresentation } from "../core/types"
import { generateRandomPresentationId } from "../core/presentations/utils"

interface SavePresentationModalProps {}

const keyboardId = "savePresentationName"

const SavePresentationModal: React.FC<SavePresentationModalProps> = () => {
  const presentationNameFieldRef = useRef()
  const spectacleContext = useSpectacle()
  const { left, top } = spectacleContext.savePresentationModalPosition
  const [presentationName, setPresentationName] = useState("")

  const showVisualKeyboard = useCallback((target, initialValue: string) => {
    visualKeyboardService.newKeyboard(
      target,
      newValue => setPresentationName(newValue),
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
      return spectacleContext.savePresentation.save({
        name: presentationName,
        savedAt: Date.now(),
        ...extraData,
      })
    },
    [presentationName, spectacleContext.savePresentation]
  )

  const handleSaveClick = () => {
    savePresentation()
  }

  const handleSaveAsNewClick = () => {
    savePresentation({ id: generateRandomPresentationId() })
  }

  const handleTextInputChange = event => {
    const value = event.target.value
    setPresentationName(value)
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
        <Button
          onClick={event =>
            spectacleContext.savePresentation.closeModal(event, "cancel")
          }
        >
          Cancel
        </Button>
        <Button onClick={handleSaveAsNewClick}>Save as new</Button>
        <Button onClick={handleSaveClick}>Save</Button>
      </DialogActions>
    </Dialog>
  )
}

export default SavePresentationModal
