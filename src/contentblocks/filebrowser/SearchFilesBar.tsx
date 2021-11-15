import React, { useCallback, useContext, useEffect, useState } from "react"
import {
  FilledInput,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
} from "@mui/material"
import createStyles from "@mui/styles/createStyles"
import makeStyles from "@mui/styles/makeStyles"
import { Close } from "@mui/icons-material"
import clsx from "clsx"
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
    <Grid container alignItems="center">
      <Grid item xs>
        <div className={classes.searchBarContainer}>
          <FormControl className={clsx(classes.searchBar)} variant="standard">
            <InputLabel htmlFor="filled-adornment-password">
              Search filesystem
            </InputLabel>
            <FilledInput
              onChange={onSearchQueryChange}
              onFocus={showVisualKeyboard}
              value={searchQuery}
              autoFocus={true}
              type={"text"}
              endAdornment={
                <InputAdornment position="start">
                  <IconButton onClick={() => setSearchMode(false)} size="large">
                    <Close />
                  </IconButton>
                </InputAdornment>
              }
            />
          </FormControl>
        </div>
      </Grid>
      <Grid item>
        <FiltersSelector />
        <ViewTypeSelector />
      </Grid>
    </Grid>
  )
}

export default SearchFilesBar
