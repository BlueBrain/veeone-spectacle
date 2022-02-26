import React from "react"
import { useFileBrowserSelectionMode } from "./FileBrowserSelectionModeContext"
import { Box, Button, IconButton, Tooltip } from "@mui/material"
import { Deselect, SelectAll } from "@mui/icons-material"
import { useFileBrowserFilter } from "../FileBrowserFilterContext"

const SelectionModeStatusBar: React.FC = () => {
  const {
    selectedFileCount,
    setIsSelectionModeEnabled,
    setSelectedFiles,
    selectedFiles,
  } = useFileBrowserSelectionMode()

  const turnOffSelectionMode = () => {
    setIsSelectionModeEnabled(false)
  }

  const { filteredFiles } = useFileBrowserFilter()

  const openSelectedFiles = () => {
    // todo open multiple selected files
    console.debug("OPEN SELECTED FILES")
  }

  const selectAllFiles = () => {
    console.debug(
      "SELECT ALL FILES",
      filteredFiles.map(value => value.path)
    )
    const newFiles = [
      ...selectedFiles,
      ...filteredFiles.map(value => value.path),
    ]
    setSelectedFiles(Array.from(new Set(newFiles)))
  }

  const deselectAllFiles = () => {
    setSelectedFiles([])
  }

  return (
    <Box>
      <Button
        onClick={openSelectedFiles}
        variant={"contained"}
        sx={{ display: selectedFileCount > 0 ? "inline-flex" : "none" }}
      >
        Open {selectedFileCount} selected{" "}
        {selectedFileCount > 1 ? "files" : "file"}
      </Button>
      <Tooltip title={"Select all"}>
        <IconButton onClick={selectAllFiles}>
          <SelectAll />
        </IconButton>
      </Tooltip>
      <Tooltip title={"Deselect"}>
        <IconButton onClick={deselectAllFiles}>
          <Deselect />
        </IconButton>
      </Tooltip>
      <Button
        onClick={turnOffSelectionMode}
        variant={"outlined"}
        color={"secondary"}
      >
        Exit selection mode
      </Button>
    </Box>
  )
}

export default SelectionModeStatusBar
