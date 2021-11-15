import React, { useContext, useState } from "react"
import {
  IconButton,
  ListItemIcon,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material"
import { Clear, Search } from "@mui/icons-material"
import { FileBrowserContext } from "../contexts/FileBrowserContext"

const NameFilterMenuItem: React.FC = () => {
  const { nameFilterQuery, filterByName } = useContext(FileBrowserContext)
  const [isFilterActive, setIsFilterActive] = useState<boolean>(false)
  const isFilteringByNameActive = isFilterActive || nameFilterQuery.length > 0

  const activateFilter = () => {
    setIsFilterActive(true)
  }

  const updateFilterQuery = (event: React.ChangeEvent<HTMLInputElement>) => {
    filterByName(event.target.value)
  }

  const clearFilter = () => {
    filterByName("")
  }

  return (
    <MenuItem onClick={activateFilter} onKeyDown={e => e.stopPropagation()}>
      <ListItemIcon>
        <Search />
      </ListItemIcon>
      {isFilteringByNameActive ? (
        <>
          <TextField
            autoFocus={true}
            value={nameFilterQuery}
            onChange={updateFilterQuery}
            label={"Filter by name"}
          />
          <IconButton onClick={clearFilter} size="large">
            <Clear />
          </IconButton>
        </>
      ) : (
        <Typography>Filter by name</Typography>
      )}
    </MenuItem>
  )
}

export default NameFilterMenuItem
