import React, { useCallback, useEffect, useRef } from "react"
import { Box, Grid, IconButton, TextField } from "@mui/material"
import { Close } from "@mui/icons-material"
import FiltersSelector from "./FiltersSelector"
import { visualKeyboardService } from "../../visualkeyboard"
import useInteractable from "../../core/interactable/useInteractable"
import { useFileBrowserSearch } from "./FileBrowserSearchContext"
import { useFileBrowser } from "./FileBrowserContext"

const SearchFilesBar: React.FC = () => {
  const { frameId } = useFileBrowser()
  const { setSearchMode, requestSearch, searchQuery } = useFileBrowserSearch()

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
    (target, initialValue: string) => {
      visualKeyboardService.newKeyboard(target, handleInputChange, {
        initialValue,
        keyboardId: frameId,
      })
    },
    [frameId, handleInputChange]
  )

  const searchFieldRef = useRef()

  useInteractable(searchFieldRef, {
    onTap: event => {
      showVisualKeyboard(event.target, searchQuery)
    },
  })

  useEffect(() => {
    const keyboardTarget = searchFieldRef.current
    return () => {
      visualKeyboardService.closeKeyboardByTarget(keyboardTarget)
    }
  }, [searchFieldRef])

  return (
    <Grid container alignItems={"center"}>
      <Grid item xs>
        <Grid container alignItems={"center"}>
          <Grid item xs>
            <Box sx={{ paddingLeft: ".3rem" }}>
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
                onFocus={event => showVisualKeyboard(event.target, searchQuery)}
                inputRef={searchFieldRef}
              />
            </Box>
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
      </Grid>
    </Grid>
  )
}

export default SearchFilesBar
