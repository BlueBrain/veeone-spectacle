import React from "react"
import { Grid, IconButton, Tooltip } from "@mui/material"
import { ArrowBack, ArrowForward, Search } from "@mui/icons-material"
import { useFileBrowserNavigator } from "./FileBrowserNavigatorContext"
import SearchFilesBar from "./SearchFilesBar"
import FiltersSelector from "./FiltersSelector"
import { useFileBrowserSearch } from "./FileBrowserSearchContext"
import { useFileBrowser } from "./FileBrowserContext"
import FloatingFrameControlBar from "../../core/frames/FloatingFrameControlBar"

const NavigationAndSearchBar: React.FC = () => {
  const { history, historyIndex } = useFileBrowser()
  const { navigateBack, navigateForward } = useFileBrowserNavigator()
  const { searchMode, setSearchMode } = useFileBrowserSearch()
  const disableForwardButton = historyIndex === 0
  const disableBackButton = historyIndex === history.length - 1

  return (
    <>
      {searchMode ? (
        <Grid container alignItems="center">
          <Grid item xs={8}>
            <SearchFilesBar />
          </Grid>
        </Grid>
      ) : (
        <Grid container alignItems="center" data-drag-handle={true}>
          <Grid item>
            <Tooltip title="Back" enterDelay={1000}>
              <span>
                <IconButton
                  onClick={navigateBack}
                  disabled={disableBackButton}
                  color={"primary"}
                  size={"large"}
                >
                  <ArrowBack fontSize={"large"} />
                </IconButton>
              </span>
            </Tooltip>
            <Tooltip title="Forward" enterDelay={1000}>
              <span>
                <IconButton
                  onClick={navigateForward}
                  disabled={disableForwardButton}
                  color={"primary"}
                  size={"large"}
                >
                  <ArrowForward fontSize={"large"} />
                </IconButton>
              </span>
            </Tooltip>
          </Grid>

          <Grid item>
            <Tooltip title="Search files and directories" enterDelay={1000}>
              <span>
                <IconButton
                  onClick={() => setSearchMode(true)}
                  color={"primary"}
                  size={"large"}
                >
                  <Search />
                </IconButton>
              </span>
            </Tooltip>

            <FiltersSelector />
          </Grid>
        </Grid>
      )}
      <FloatingFrameControlBar />
    </>
  )
}

export default NavigationAndSearchBar
