import { ListItemButton, ListItemIcon, ListItemText } from "@mui/material"
import React, { useCallback, useMemo } from "react"
import { FolderOpenRounded, FolderRounded } from "@mui/icons-material"

interface PresentationFolderListItemProps {
  name: string
  selectedFolderName: string
  onSelectFolder: (folderName: string) => void
}

const PresentationFolderListItem: React.FC<PresentationFolderListItemProps> = ({
  name,
  onSelectFolder,
  selectedFolderName,
}) => {
  const handleClick = useCallback(() => onSelectFolder(name), [
    name,
    onSelectFolder,
  ])
  const isSelected = useMemo(() => name === selectedFolderName, [
    name,
    selectedFolderName,
  ])

  return (
    <ListItemButton onClick={handleClick} selected={isSelected}>
      <ListItemIcon>
        {isSelected ? <FolderOpenRounded /> : <FolderRounded />}
      </ListItemIcon>
      <ListItemText primary={name} />
    </ListItemButton>
  )
}

export default PresentationFolderListItem
