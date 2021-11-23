import React, { useCallback, useContext, useEffect, useRef } from "react"
import { Grid, IconButton, TextField } from "@mui/material"
import { Close } from "@mui/icons-material"
import { FileBrowserContext } from "./FileBrowserContext"
import ViewTypeSelector from "./ViewTypeSelector"
import FiltersSelector from "./FiltersSelector"
import { visualKeyboardService } from "../../visualkeyboard"
import useInteractable from "../../core/interactable/useInteractable"

const SearchFilesBar: React.FC = () => {
  const { setSearchMode, requestSearch, searchQuery, frameId } = useContext(
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
