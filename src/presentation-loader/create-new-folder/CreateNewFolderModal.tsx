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
import { useVisualKeyboard } from "../../visualkeyboard/VisualKeyboardContext"
import { KeyboardId } from "../../visualkeyboard/types"

const CreateNewFolderModal: React.FC = () => {
  const keyboardId: KeyboardId = "createNewFolderName"
  const folderNameRef = useRef()
  const { resolveDialog, cancelDialog } = useActiveDialog()
  const [folderName, setFolderName] = useState("")
  const {
    openKeyboard,
    closeKeyboard,
    updateKeyboardState,
  } = useVisualKeyboard()

  const createNewFolderAndClose = useCallback(() => {
    const newFolder = {
      folderName,
    }
    resolveDialog(newFolder)
  }, [folderName, resolveDialog])

  const handleTextInputChange = event => {
    const value = event.target.value
    setFolderName(value)
    updateKeyboardState(keyboardId, value)
  }

  const showVisualKeyboard = useCallback(
    (target, initialValue: string) => {
      openKeyboard({
        target,
        onInputChange: newValue => setFolderName(newValue),
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
