import React, { useContext, useState } from "react"
import { IconButton, Menu, MenuItem, Tooltip } from "@material-ui/core"
import { ViewColumn } from "@material-ui/icons"
import { FileBrowserContext } from "../../contexts/FileBrowserContext"
import { FileBrowserViewTypes } from "../../common/types"

interface ViewTypeSelectorProps {}

const ViewTypeSelector: React.FC<ViewTypeSelectorProps> = () => {
  const { changeViewType } = useContext(FileBrowserContext)
  const [
    viewTypeAnchorElement,
    setViewTypeAnchorElement,
  ] = useState<null | HTMLElement>(null)

  const openChangeViewTypeMenu = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    setViewTypeAnchorElement(event.currentTarget)
  }

  const onCloseMenu = () => {
    setViewTypeAnchorElement(null)
  }

  const setViewToList = () => {
    changeViewType(FileBrowserViewTypes.List)
    onCloseMenu()
  }
  const setViewToThumbnails = () => {
    changeViewType(FileBrowserViewTypes.Thumbnails)
    onCloseMenu()
  }

  return (
    <>
      <Tooltip title="Switch view between list and thumbnails">
        <IconButton onClick={openChangeViewTypeMenu}>
          <ViewColumn />
        </IconButton>
      </Tooltip>
      <Menu
        id="viewType"
        anchorEl={viewTypeAnchorElement}
        open={Boolean(viewTypeAnchorElement)}
        onClose={onCloseMenu}
      >
        <MenuItem onClick={setViewToList}>List</MenuItem>
        <MenuItem onClick={setViewToThumbnails}>Thumbnails</MenuItem>
      </Menu>
    </>
  )
}

export default ViewTypeSelector
