import React, { useState } from "react"
import { IconButton, Menu, MenuItem, Tooltip } from "@mui/material"
import { History } from "@mui/icons-material"
import { useFileBrowserNavigator } from "./FileBrowserNavigatorContext"
import { useFileBrowser } from "./FileBrowserContext"

interface BrowsingHistorySelectorProps {}

const BrowsingHistorySelector: React.FC<BrowsingHistorySelectorProps> = () => {
  const { history, historyIndex } = useFileBrowser()
  const { navigateToIndex } = useFileBrowserNavigator()
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
      <Tooltip title="Show recently visited folders" enterDelay={1000}>
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
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
      >
        {history.map((historyItem, index) => (
          <MenuItem
            key={index}
            selected={index === historyIndex}
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
