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
  } = useFileBrowserSelectionMode()

  const { requestMultipleFiles } = useFileBrowserNavigator()

  const { filteredFiles } = useFileBrowserFilter()

  const openSelectedFiles = () => {
    console.debug("openSelectedFiles", selectedFiles)
    requestMultipleFiles(selectedFiles)
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
    <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
      <SelectionModeSwitch />

      {isSelectionModeEnabled ? (
        <>
          <Tooltip title={"Select all"}>
            <span>
              <IconButton onClick={selectAllFiles}>
                <SelectAll />
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip title={"Deselect"}>
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
