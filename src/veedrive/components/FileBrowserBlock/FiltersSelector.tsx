import {
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Tooltip,
  Typography,
} from "@material-ui/core"
import { Check, FilterList } from "@material-ui/icons"
import React, { useContext, useState } from "react"
import { FileBrowserContext } from "../../contexts/FileBrowserContext"

const FiltersSelector: React.FC = () => {
  const {
    isShowingHiddenFiles,
    isShowingSupportedFilesOnly,
    toggleShowHiddenFilesFilter,
    toggleShowSupportedFilesOnlyFilter,
  } = useContext(FileBrowserContext)
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

  const handleSupportedFilesToggle = () => {
    onCloseMenu()
    toggleShowSupportedFilesOnlyFilter()
  }

  return (
    <>
      <Tooltip title="Filter view">
        <IconButton onClick={openMenu}>
          <FilterList />
        </IconButton>
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
        <MenuItem onClick={handleSupportedFilesToggle}>
          <ListItemIcon>
            {isShowingSupportedFilesOnly ? <Check /> : null}
          </ListItemIcon>
          <Typography>Hide unsupported files</Typography>
        </MenuItem>
      </Menu>
    </>
  )
}

export default FiltersSelector
