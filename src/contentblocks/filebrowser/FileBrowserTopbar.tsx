import React from "react"
import { Grid, IconButton, Tooltip } from "@mui/material"
import {
  ArrowBack,
  ArrowForward,
  ArrowUpward,
  Home,
  Search,
} from "@mui/icons-material"
import { useFileBrowser } from "./FileBrowserContext"
import BrowsingHistorySelector from "./BrowsingHistorySelector"
import ViewTypeSelector from "./ViewTypeSelector"
import SearchFilesBar from "./SearchFilesBar"
import FiltersSelector from "./FiltersSelector"
import PathParts from "./PathParts"
import FrameControlBar from "../../core/frames/FrameControlBar"

const FileBrowserTopbar: React.FC = () => {
  const {
    openDirectoryByPathPartIndex,
    activePath,
    history,
    historyIndex,
    navigateBack,
    navigateForward,
    navigateUp,
    navigateDirectory,
    setSearchMode,
    searchModeOn,
  } = useFileBrowser()

  const navigateHome = () => {
    void navigateDirectory("")
  }

  const disableForwardButton = historyIndex === 0
  const disableBackButton = historyIndex === history.length - 1
  const hideUpButton = activePath.length === 0

  return (
    <>
      {searchModeOn ? (
        <Grid container alignItems="center">
          <Grid item>
            <FrameControlBar />
          </Grid>
          <Grid item xs>
            <SearchFilesBar />
          </Grid>
        </Grid>
      ) : (
        <Grid container alignItems="center" data-drag-handle={true}>
          <Grid item>
            <FrameControlBar />
          </Grid>
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

            {!hideUpButton ? (
              <Tooltip title="Move to the parent directory">
                <span>
                  <IconButton onClick={navigateUp} color={"primary"}>
                    <ArrowUpward />
                  </IconButton>
                </span>
              </Tooltip>
            ) : null}

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
          </Grid>

          <Grid item xs>
            <PathParts
              path={activePath}
              onSelectPathPart={openDirectoryByPathPartIndex}
            />
          </Grid>

          <Grid item>
            <Tooltip title="Search files and directories">
              <IconButton onClick={() => setSearchMode(true)} color={"primary"}>
                <Search />
              </IconButton>
            </Tooltip>

            <FiltersSelector />

            <ViewTypeSelector />
          </Grid>
        </Grid>
      )}
    </>
  )
}

export default FileBrowserTopbar
