import React, { useContext } from "react"
import { FilledInput, FormControl, Grid, IconButton, InputAdornment, InputLabel } from "@mui/material";
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';
import { Close } from "@mui/icons-material"
import clsx from "clsx"
import { FileBrowserContext } from "../contexts/FileBrowserContext"
import ViewTypeSelector from "./ViewTypeSelector"

const useStyles = makeStyles(theme =>
  createStyles({
    searchBarContainer: {},
    searchBar: {
      width: "100%",
    },
  })
)

const SearchFilesBar: React.FC = () => {
  const classes = useStyles()
  const { setSearchMode, requestSearch, searchQuery } = useContext(
    FileBrowserContext
  )

  const onSearchQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    void requestSearch(event.target.value)
  }

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
        <ViewTypeSelector />
      </Grid>
    </Grid>
  );
}

export default SearchFilesBar
