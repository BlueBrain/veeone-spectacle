import { Box, Button } from "@mui/material"
import React from "react"
import { useFileBrowserSelectionMode } from "./FileBrowserSelectionModeContext"

const SelectionModeSwitch: React.FC = () => {
  const {
    isSelectionModeEnabled,
    setIsSelectionModeEnabled,
  } = useFileBrowserSelectionMode()

  const turnOnSelectionMode = () => {
    setIsSelectionModeEnabled(true)
  }

  const turnOffSelectionMode = () => {
    setIsSelectionModeEnabled(false)
  }

  return (
    <Box>
      {isSelectionModeEnabled ? (
        <Button
          onClick={turnOffSelectionMode}
          variant={"outlined"}
          color={"secondary"}
        >
          Exit selection mode
        </Button>
      ) : (
        <Button
          onClick={turnOnSelectionMode}
          variant={"outlined"}
          color={"secondary"}
        >
          Select multiple files
        </Button>
      )}
    </Box>
  )
}

export default SelectionModeSwitch
