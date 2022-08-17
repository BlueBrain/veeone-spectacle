import { List, ListItem, ListItemIcon, ListItemText } from "@mui/material"
import React from "react"
import FolderIcon from "@mui/icons-material/Folder"

const PresentationFolderList: React.FC = () => {
  const folderList = ["...", "...", "...", "...", "...", "...", "...", "..."]

  return (
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
  )
}

export default PresentationFolderList
