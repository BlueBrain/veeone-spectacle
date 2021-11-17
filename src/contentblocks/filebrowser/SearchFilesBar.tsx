import React, { useCallback, useContext, useEffect, useState } from "react"
import { Grid, IconButton, TextField } from "@mui/material"
import { Close } from "@mui/icons-material"
import { FileBrowserContext } from "./FileBrowserContext"
import ViewTypeSelector from "./ViewTypeSelector"
import FiltersSelector from "./FiltersSelector"
import { visualKeyboardService } from "../../visualkeyboard"

const SearchFilesBar: React.FC = () => {
  const [keyboardId, setKeyboardId] = useState(null)
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
    (event, initialValue: string) => {
      const newKeyboardId = visualKeyboardService.newKeyboard(
        event.target,
        handleInputChange,
        { initialValue }
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
              onFocus={event => showVisualKeyboard(event, searchQuery)}
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
