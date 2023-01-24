import React from "react"
import { useFileBrowserSelectionMode } from "./FileBrowserSelectionModeContext"
import { Box, Button, IconButton, Tooltip } from "@mui/material"
import { Deselect, SelectAll } from "@mui/icons-material"
import { useFileBrowserFilter } from "../FileBrowserFilterContext"
import { useFileBrowserNavigator } from "../FileBrowserNavigatorContext"
import SelectionModeSwitch from "./SelectionModeSwitch"

const SelectionModeStatusBar: React.FC = () => {
  const {
    isSelectionModeEnabled,
    selectedFileCount,
    setSelectedFiles,
    selectedFiles,
    setIsSelectionModeEnabled,
  } = useFileBrowserSelectionMode()

  const { requestMultipleFiles } = useFileBrowserNavigator()

  const { filteredFiles } = useFileBrowserFilter()

  const openSelectedFiles = () => {
    requestMultipleFiles(selectedFiles)
    setSelectedFiles([])
    setIsSelectionModeEnabled(false)
  }

  const selectAllFiles = () => {
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
    <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
      <SelectionModeSwitch />

      {isSelectionModeEnabled ? (
        <>
          <Tooltip title={"Select all"} enterDelay={1000}>
            <span>
              <IconButton onClick={selectAllFiles}>
                <SelectAll />
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip title={"Deselect"} enterDelay={1000}>
            <span>
              <IconButton onClick={deselectAllFiles}>
                <Deselect />
              </IconButton>
            </span>
          </Tooltip>
          <Button
            onClick={openSelectedFiles}
            variant={"contained"}
            sx={{ display: selectedFileCount > 0 ? "inline-flex" : "none" }}
          >
            Open {selectedFileCount} selected{" "}
            {selectedFileCount > 1 ? "files" : "file"}
          </Button>
        </>
      ) : null}
    </Box>
  )
}

export default SelectionModeStatusBar
