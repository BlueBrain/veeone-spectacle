import React, { useContext } from "react"
import { Grid, IconButton, Tooltip } from "@mui/material"
import {
  ArrowBack,
  ArrowForward,
  ArrowUpward,
  Home,
  Search,
} from "@mui/icons-material"
import { FileBrowserContext } from "./FileBrowserContext"
import BrowsingHistorySelector from "./BrowsingHistorySelector"
import ViewTypeSelector from "./ViewTypeSelector"
import SearchFilesBar from "./SearchFilesBar"
import FiltersSelector from "./FiltersSelector"
import PathParts from "./PathParts"

interface Props {
  onSelectPathPart(pathPart: number)
}

const FileBrowserTopbar: React.FC<Props> = ({ onSelectPathPart }) => {
  const {
    activePath,
    history,
    historyIndex,
    navigateBack,
    navigateForward,
    navigateUp,
    navigateDirectory,
    setSearchMode,
    searchModeOn,
  } = useContext(FileBrowserContext)

  const navigateHome = () => {
    void navigateDirectory("")
  }

  const disableForwardButton = historyIndex === 0
  const disableBackButton = historyIndex === history.length - 1
  const hideUpButton = activePath.length === 0

  return (
    <>
      {searchModeOn ? (
        <SearchFilesBar />
      ) : (
        <Grid container alignItems="center">
          <Grid item>
            <Tooltip title="Back">
              <span>
                <IconButton
                  onClick={navigateBack}
                  disabled={disableBackButton}
                  color={"primary"}
                >
                  <ArrowBack />
                </IconButton>
              </span>
            </Tooltip>
            <Tooltip title="Forward">
              <span>
                <IconButton
                  onClick={navigateForward}
                  disabled={disableForwardButton}
                  color={"primary"}
                >
                  <ArrowForward />
                </IconButton>
              </span>
            </Tooltip>

            <BrowsingHistorySelector />

            <Tooltip title="Move to the home directory">
              <span>
                <IconButton
                  onClick={navigateHome}
                  disabled={hideUpButton}
                  color={"primary"}
                >
                  <Home />
                </IconButton>
              </span>
            </Tooltip>

            {!hideUpButton ? (
              <Tooltip title="Move to the parent directory">
                <span>
                  <IconButton onClick={navigateUp} color={"primary"}>
                    <ArrowUpward />
                  </IconButton>
                </span>
              </Tooltip>
            ) : null}
          </Grid>

          <Grid item xs>
            <PathParts path={activePath} onSelectPathPart={onSelectPathPart} />
          </Grid>

          <Grid item>
            <FiltersSelector />

            <Tooltip title="Search files and directories">
              <IconButton onClick={() => setSearchMode(true)} color={"primary"}>
                <Search />
              </IconButton>
            </Tooltip>

            <ViewTypeSelector />
          </Grid>
        </Grid>
      )}
    </>
  )
}

export default FileBrowserTopbar
