import {
  Button,
  Grid,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material"
import React, { useCallback } from "react"
import FolderIcon from "@mui/icons-material/Folder"
import { useDialogs } from "../../../dialogs/DialogsContext"
import CreateNewFolderModal from "../create-new-folder/CreateNewFolderModal"
import { useActiveDialog } from "../../../dialogs/ActiveDialogContext"
import { useVisualKeyboard } from "../../../visualkeyboard/VisualKeyboardContext"
import { usePresentationManager } from "../../presentation-manager/PresentationManagerContext"
import { CancelRounded, DoNotDisturb } from "@mui/icons-material"
import PresentationFolderListItem from "./PresentationFolderListItem"

interface PresentationFolderListProps {
  selectedFolderName: string
  onSelectFolder: (folderName: string) => void
}

const PresentationFolderList: React.FC<PresentationFolderListProps> = ({
  selectedFolderName,
  onSelectFolder,
}) => {
  const dialogs = useDialogs()
  const { dialogOptions } = useActiveDialog()
  const { closeKeyboardById } = useVisualKeyboard()
  const { folderList } = usePresentationManager()

  const openCreateNewFolderDialog = useCallback(async () => {
    closeKeyboardById("savePresentationName")
    await dialogs.openDialog(CreateNewFolderModal, {
      position: dialogOptions.position,
      maxWidth: "xs",
    })
  }, [closeKeyboardById, dialogOptions.position, dialogs])

  return (
    <Grid container>
      <Grid item>
        <List>
          <ListItemButton
            onClick={() => onSelectFolder(null)}
            selected={!selectedFolderName}
            color={"secondary"}
          >
            <ListItemIcon>
              <DoNotDisturb />
            </ListItemIcon>
            No folder
          </ListItemButton>
          {folderList.map((name, i) => (
            <PresentationFolderListItem
              key={i}
              name={name}
              onSelectFolder={onSelectFolder}
              selectedFolderName={selectedFolderName}
            />
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
