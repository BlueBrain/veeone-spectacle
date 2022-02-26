import {
  Badge,
  Divider,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Tooltip,
  Typography,
} from "@mui/material"
import { Check, FilterList } from "@mui/icons-material"
import React, { useState } from "react"
import NameFilterMenuItem from "./NameFilterMenuItem"
import { useFileBrowser } from "./FileBrowserContext"
import { useFileBrowserFilter } from "./FileBrowserFilterContext"

const FiltersSelector: React.FC = () => {
  const { isShowingHiddenFiles, isShowingUnsupportedFiles } = useFileBrowser()
  const {
    toggleShowHiddenFilesFilter,
    toggleShowUnsupportedFilesFilter,
    nameFilterQuery,
  } = useFileBrowserFilter()

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

  const handleHiddenFilesToggle = () => {
    onCloseMenu()
    toggleShowHiddenFilesFilter()
  }

  const handleUnsupportedFilesToggle = () => {
    onCloseMenu()
    toggleShowUnsupportedFilesFilter()
  }

  const activeFiltersCount: number =
    (isShowingHiddenFiles ? 1 : 0) +
    (isShowingUnsupportedFiles ? 1 : 0) +
    (nameFilterQuery.length > 0 ? 1 : 0)

  return (
    <>
      <Tooltip title="Filter view">
        <span>
          <IconButton onClick={openMenu} color={"primary"} size={"large"}>
            <Badge badgeContent={activeFiltersCount} color={"error"}>
              <FilterList />
            </Badge>
          </IconButton>
        </span>
      </Tooltip>
      <Menu
        id="viewType"
        anchorEl={viewTypeAnchorElement}
        open={Boolean(viewTypeAnchorElement)}
        onClose={onCloseMenu}
      >
        <MenuItem onClick={handleHiddenFilesToggle}>
          <ListItemIcon>{isShowingHiddenFiles ? <Check /> : null}</ListItemIcon>
          <Typography>Show hidden files</Typography>
        </MenuItem>
        <MenuItem onClick={handleUnsupportedFilesToggle}>
          <ListItemIcon>
            {isShowingUnsupportedFiles ? <Check /> : null}
          </ListItemIcon>
          <Typography>Show unsupported files</Typography>
        </MenuItem>
        <Divider />
        <NameFilterMenuItem />
      </Menu>
    </>
  )
}

export default FiltersSelector
