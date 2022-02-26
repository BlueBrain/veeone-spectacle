import React from "react"
import { IconButton, Tooltip } from "@mui/material"
import { ViewColumn, ViewComfy } from "@mui/icons-material"
import { FileBrowserViewTypes } from "./types"
import { useFileBrowser } from "./FileBrowserContext"

const VIEW_TYPES = {
  [FileBrowserViewTypes.Thumbnails]: {
    icon: <ViewColumn />,
    tooltip: "Switch to list",
    switchTo: FileBrowserViewTypes.List,
  },
  [FileBrowserViewTypes.List]: {
    icon: <ViewComfy />,
    tooltip: "Switch to thumbnails",
    switchTo: FileBrowserViewTypes.Thumbnails,
  },
}

const ViewTypeSelector: React.FC = () => {
  const { changeViewType, viewType } = useFileBrowser()

  const toggleViewType = () => {
    changeViewType(VIEW_TYPES[viewType].switchTo)
  }

  return (
    <>
      <Tooltip title={VIEW_TYPES[viewType].tooltip}>
        <span>
          <IconButton onClick={toggleViewType} color={"primary"} size={"large"}>
            {VIEW_TYPES[viewType].icon}
          </IconButton>
        </span>
      </Tooltip>
    </>
  )
}

export default ViewTypeSelector
