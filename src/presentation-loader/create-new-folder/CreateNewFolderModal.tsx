import {
  Box,
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material"
import React, { useCallback, useEffect, useRef, useState } from "react"
import { useActiveDialog } from "../../dialogs/ActiveDialogContext"
import { visualKeyboardService } from "../../visualkeyboard"

const keyboardId = "createNewFolderName"

const CreateNewFolderModal: React.FC = () => {
  const folderNameRef = useRef()
  const { resolveDialog, cancelDialog } = useActiveDialog()
  const [folderName, setFolderName] = useState("")

  const createNewFolderAndClose = useCallback(() => {
    const newFolder = {
      folderName,
    }
    resolveDialog(newFolder)
  }, [folderName, resolveDialog])

  const handleTextInputChange = event => {
    const value = event.target.value
    setFolderName(value)
    visualKeyboardService.updateKeyboardState(keyboardId, value)
  }

  const showVisualKeyboard = useCallback((target, initialValue: string) => {
    visualKeyboardService.newKeyboard(
      target,
      newValue => setFolderName(newValue),
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

  return (
    <>
      <DialogTitle>Create new folder</DialogTitle>
      <DialogContent>
        <Box sx={{ py: 3 }}>
          <TextField
            inputRef={folderNameRef}
            type={"text"}
            variant={"outlined"}
            label={"Folder name"}
            autoFocus={true}
            fullWidth={true}
            value={folderName}
            onChange={handleTextInputChange}
            onFocus={event => showVisualKeyboard(event.target, folderName)}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={cancelDialog}>Cancel</Button>
        <Button onClick={createNewFolderAndClose} variant={"contained"}>
          Create
        </Button>
      </DialogActions>
    </>
  )
}

export default CreateNewFolderModal
