import React, { useCallback, useContext, useEffect, useState } from "react"
import { Grid, IconButton, TextField } from "@mui/material"
import createStyles from "@mui/styles/createStyles"
import makeStyles from "@mui/styles/makeStyles"
import { Close } from "@mui/icons-material"
import { FileBrowserContext } from "./FileBrowserContext"
import ViewTypeSelector from "./ViewTypeSelector"
import FiltersSelector from "./FiltersSelector"
import { visualKeyboardService } from "../../visualkeyboard"

const useStyles = makeStyles(theme =>
  createStyles({
    searchBarContainer: {},
    searchBar: {
      width: "100%",
    },
  })
)

const SearchFilesBar: React.FC = () => {
  const [keyboardId, setKeyboardId] = useState(null)
  const classes = useStyles()
  const { setSearchMode, requestSearch, searchQuery } = useContext(
    FileBrowserContext
  )

  const onSearchQueryChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    await requestSearch(event.target.value)
  }

  const handleInputChange = useCallback(
    (value: string) => {
      console.log("handleOnChange for component", value)
      requestSearch(value)
    },
    [requestSearch]
  )

  const showVisualKeyboard = useCallback(
    event => {
      const newKeyboardId = visualKeyboardService.newKeyboard(
        event.target,
        handleInputChange
      )
      setKeyboardId(newKeyboardId)
    },
    [handleInputChange]
  )

  useEffect(() => {
    return () => {
      visualKeyboardService.closeKeyboard(keyboardId)
    }
  }, [keyboardId])

  return (
    <Grid container alignItems={"center"}>
      <Grid item xs>
        <Grid container alignItems={"center"}>
          <Grid item xs>
            <TextField
              type={"text"}
              size={"small"}
              variant={"outlined"}
              margin={"dense"}
              label={"Search filesystem"}
              autoFocus={true}
              fullWidth={true}
              value={searchQuery}
              onChange={onSearchQueryChange}
              onFocus={showVisualKeyboard}
            />
          </Grid>
          <Grid item>
            <IconButton onClick={() => setSearchMode(false)} size={"small"}>
              <Close />
            </IconButton>
          </Grid>
        </Grid>
      </Grid>
      <Grid item>
        <FiltersSelector />
        <ViewTypeSelector />
      </Grid>
    </Grid>
  )
}

export default SearchFilesBar
