import {
  Button,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material"
import React, { useCallback } from "react"
import FolderIcon from "@mui/icons-material/Folder"
import { useDialogs } from "../../dialogs/DialogsContext"
import CreateNewFolderModal from "../create-new-folder/CreateNewFolderModal"
import { useActiveDialog } from "../../dialogs/ActiveDialogContext"
import { visualKeyboardService } from "../../visualkeyboard"

const PresentationFolderList: React.FC = () => {
  const dialogs = useDialogs()
  const { dialogOptions } = useActiveDialog()
  const folderList = ["...", "...", "...", "...", "...", "...", "...", "..."]

  const openCreateNewFolderDialog = useCallback(async () => {
    visualKeyboardService.closeKeyboard("savePresentationName")
    const newFolder = await dialogs.openDialog(CreateNewFolderModal, {
      position: dialogOptions.position,
      maxWidth: "xs",
    })
  }, [dialogOptions.position, dialogs])

  return (
    <Grid container>
      <Grid item>
        <List>
          {folderList.map((name, i) => (
            <ListItem key={i}>
              <ListItemIcon>
                <FolderIcon />
              </ListItemIcon>
              <ListItemText primary={name} />
            </ListItem>
          ))}
        </List>
      </Grid>
      <Grid item>
        <Button onClick={openCreateNewFolderDialog}>Create new folder</Button>
      </Grid>
    </Grid>
  )
}

export default PresentationFolderList
