import React, { useContext, useState } from "react"
import { IconButton, Menu, MenuItem, Tooltip } from "@mui/material"
import { History } from "@mui/icons-material"
import { FileBrowserContext } from "./FileBrowserContext"

interface BrowsingHistorySelectorProps {}

const BrowsingHistorySelector: React.FC<BrowsingHistorySelectorProps> = () => {
  const { navigateToIndex, history } = useContext(FileBrowserContext)
  const [
    viewTypeAnchorElement,
    setViewTypeAnchorElement,
  ] = useState<null | HTMLElement>(null)

  const openMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    setViewTypeAnchorElement(event.currentTarget)
  }

  const onCloseMenu = () => {
    setViewTypeAnchorElement(null)
  }

  const onSelectHistoryItem = (dirPath, index) => {
    navigateToIndex(index)
    onCloseMenu()
  }

  const shouldDisableButton = history.length <= 1

  return (
    <>
      <Tooltip title="Show recently visited folders">
        <span>
          <IconButton
            onClick={openMenu}
            disabled={shouldDisableButton}
            color={"primary"}
          >
            <History />
          </IconButton>
        </span>
      </Tooltip>
      <Menu
        id="viewType"
        anchorEl={viewTypeAnchorElement}
        open={Boolean(viewTypeAnchorElement)}
        onClose={onCloseMenu}
      >
        {history.map((historyItem, index) => (
          <MenuItem
            key={index}
            onClick={() => onSelectHistoryItem(historyItem, index)}
          >
            {historyItem || "/"}
          </MenuItem>
        ))}
      </Menu>
    </>
  )
}

export default BrowsingHistorySelector
