import { Grid, List, ListItemButton, ListItemIcon } from "@mui/material"
import React, { useCallback, useMemo } from "react"
import { useDialogs } from "../../../dialogs/DialogsContext"
import CreateNewFolderModal from "../create-new-folder/CreateNewFolderModal"
import { useActiveDialog } from "../../../dialogs/ActiveDialogContext"
import { useVisualKeyboard } from "../../../visualkeyboard/VisualKeyboardContext"
import { usePresentationManager } from "../../presentation-manager/PresentationManagerContext"
import { Add, DoNotDisturb } from "@mui/icons-material"
import PresentationFolderListItem from "./PresentationFolderListItem"
import { CreateNewFolderModalResult } from "../types"

interface PresentationFolderListProps {
  selectedFolderName: string
  onSelectFolder: (folderName: string) => void
  showCreateNewFolderButton?: boolean
  showNoFolderButton?: boolean
}

const PresentationFolderList: React.FC<PresentationFolderListProps> = ({
  selectedFolderName,
  onSelectFolder,
  showCreateNewFolderButton = true,
  showNoFolderButton = true,
}) => {
  const dialogs = useDialogs()
  const { dialogOptions } = useActiveDialog()
  const { closeKeyboardById } = useVisualKeyboard()
  const { folderList } = usePresentationManager()

  const openCreateNewFolderDialog = useCallback(async () => {
    closeKeyboardById("savePresentationName")
    const result: CreateNewFolderModalResult = await dialogs.openDialog(
      CreateNewFolderModal,
      {
        position: dialogOptions.position,
        maxWidth: "xs",
      }
    )
    onSelectFolder(result.folderName)
  }, [closeKeyboardById, dialogOptions.position, dialogs, onSelectFolder])

  const noFolderButton = useMemo(
    () =>
      showNoFolderButton ? (
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
      ) : null,
    [onSelectFolder, selectedFolderName, showNoFolderButton]
  )

  const createNewFolderButton = useMemo(
    () =>
      showCreateNewFolderButton ? (
        <ListItemButton onClick={openCreateNewFolderDialog}>
          <ListItemIcon>
            <Add />
          </ListItemIcon>
          New folder
        </ListItemButton>
      ) : null,
    [openCreateNewFolderDialog, showCreateNewFolderButton]
  )

  const folderItems = useMemo(
    () =>
      folderList.map((name, i) => (
        <PresentationFolderListItem
          key={i}
          name={name}
          onSelectFolder={onSelectFolder}
          selectedFolderName={selectedFolderName}
        />
      )),
    [folderList, onSelectFolder, selectedFolderName]
  )

  return (
    <Grid container>
      <Grid item>
        <List>
          {noFolderButton}

          {folderItems}

          {createNewFolderButton}
        </List>
      </Grid>
    </Grid>
  )
}

export default PresentationFolderList
