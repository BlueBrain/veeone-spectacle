import React, { useContext } from "react"
import {
  createStyles,
  FilledInput,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  makeStyles,
} from "@material-ui/core"
import { Close } from "@material-ui/icons"
import clsx from "clsx"
import { FileBrowserContext } from "../../contexts/FileBrowserContext"
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
  const { setSearchMode, requestSearch } = useContext(FileBrowserContext)

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
              autoFocus={true}
              type={"text"}
              endAdornment={
                <InputAdornment position="start">
                  <IconButton onClick={() => setSearchMode(false)}>
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
  )
}

export default SearchFilesBar
