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
import SpectacleContext from "../core/spectacle/SpectacleContext"
import { visualKeyboardService } from "../visualkeyboard"
import { SpectaclePresentation } from "../core/types"
import { generateRandomPresentationId } from "../core/presentations/utils"

interface SavePresentationModalProps {}

const SavePresentationModal: React.FC<SavePresentationModalProps> = () => {
  const spectacleContext = useContext(SpectacleContext)
  const presentationNameFieldRef = useRef()
  const [presentationName, setPresentationName] = useState("")

  const keyboardId = "presentationName"

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
  }, [keyboardId])

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

  return (
    <Dialog
      open={spectacleContext.savePresentation.isModalOpen}
      onClose={spectacleContext.savePresentation.closeModal}
      fullWidth={true}
      sx={{ top: "-40%" }}
    >
      <DialogTitle>Save presentation</DialogTitle>
      <DialogContent>
        <Grid container alignItems={"center"} sx={{ py: 3 }}>
          <Grid item xs>
            <TextField
              inputRef={presentationNameFieldRef}
              type={"text"}
              variant={"outlined"}
              label={"Name of your presentation"}
              autoFocus={true}
              fullWidth={true}
              value={presentationName}
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
