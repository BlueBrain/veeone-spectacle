import React, { useContext } from "react"
import { IconButton, Tooltip } from "@material-ui/core"
import { ViewColumn, ViewComfy } from "@material-ui/icons"
import { FileBrowserContext } from "../../contexts/FileBrowserContext"
import { FileBrowserViewTypes } from "../../common/types"

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
  const { changeViewType, viewType } = useContext(FileBrowserContext)

  const toggleViewType = () => {
    changeViewType(VIEW_TYPES[viewType].switchTo)
  }

  return (
    <>
      <Tooltip title={VIEW_TYPES[viewType].tooltip}>
        <IconButton onClick={toggleViewType}>
          {VIEW_TYPES[viewType].icon}
        </IconButton>
      </Tooltip>
    </>
  )
}

export default ViewTypeSelector
