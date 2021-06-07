import React, { useState } from "react"
import { IconButton, Menu, MenuItem, Tooltip } from "@material-ui/core"
import { ViewColumn } from "@material-ui/icons"

interface ViewTypeSelectorProps {}

const ViewTypeSelector: React.FC<ViewTypeSelectorProps> = () => {
  // TODO needs implementation
  const [
    viewTypeAnchorElement,
    setViewTypeAnchorElement,
  ] = useState<null | HTMLElement>(null)

  const openChangeViewTypeMenu = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    setViewTypeAnchorElement(event.currentTarget)
  }

  const closeChangeViewTypeMenu = () => {
    setViewTypeAnchorElement(null)
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
        onClose={closeChangeViewTypeMenu}
      >
        <MenuItem>List</MenuItem>
        <MenuItem>Thumbnails</MenuItem>
      </Menu>
    </>
  )
}

export default ViewTypeSelector
