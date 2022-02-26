import React from "react"
import { Grid, IconButton, Tooltip } from "@mui/material"
import {
  ArrowBack,
  ArrowForward,
  ArrowUpward,
  Home,
  Search,
} from "@mui/icons-material"
import { useFileBrowserNavigator } from "./FileBrowserNavigatorContext"
import BrowsingHistorySelector from "./BrowsingHistorySelector"
import ViewTypeSelector from "./ViewTypeSelector"
import SearchFilesBar from "./SearchFilesBar"
import FiltersSelector from "./FiltersSelector"
import PathParts from "./PathParts"
import FrameControlBar from "../../core/frames/FrameControlBar"
import { useFileBrowserSearch } from "./FileBrowserSearchContext"
import { useFileBrowser } from "./FileBrowserContext"
import FloatingFrameControlBar from "../../core/frames/FloatingFrameControlBar"

const FileBrowserTopbar: React.FC = () => {
  const { history, historyIndex, activePath } = useFileBrowser()
  const {
    openDirectoryByPathPartIndex,
    navigateBack,
    navigateForward,
    navigateUp,
    navigateDirectory,
  } = useFileBrowserNavigator()

  const { searchMode, setSearchMode } = useFileBrowserSearch()

  // const navigateHome = () => {
  //   void navigateDirectory("")
  // }

  const disableForwardButton = historyIndex === 0
  const disableBackButton = historyIndex === history.length - 1
  const hideUpButton = activePath.length === 0

  return (
    <>
      {searchMode ? (
        <Grid container alignItems="center">
          <Grid item xs={8}>
            <SearchFilesBar />
          </Grid>
          {/*<Grid item>*/}
          {/*  <FrameControlBar />*/}
          {/*</Grid>*/}
        </Grid>
      ) : (
        <Grid container alignItems="center" data-drag-handle={true}>
          {/*<Grid item>*/}
          {/*  <FrameControlBar />*/}
          {/*</Grid>*/}
          <Grid item>
            <Tooltip title="Back">
              <span>
                <IconButton
                  onClick={navigateBack}
                  disabled={disableBackButton}
                  color={"primary"}
                  size={"large"}
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
                  size={"large"}
                >
                  <ArrowForward />
                </IconButton>
              </span>
            </Tooltip>

            {/*<BrowsingHistorySelector />*/}

            {/*{!hideUpButton ? (*/}
            {/*  <Tooltip title="Move to the parent directory">*/}
            {/*    <span>*/}
            {/*      <IconButton*/}
            {/*        onClick={navigateUp}*/}
            {/*        color={"primary"}*/}
            {/*        size={"large"}*/}
            {/*      >*/}
            {/*        <ArrowUpward />*/}
            {/*      </IconButton>*/}
            {/*    </span>*/}
            {/*  </Tooltip>*/}
            {/*) : null}*/}

            {/*<Tooltip title="Move to the home directory">*/}
            {/*  <span>*/}
            {/*    <IconButton*/}
            {/*      onClick={navigateHome}*/}
            {/*      disabled={hideUpButton}*/}
            {/*      color={"primary"}*/}
            {/*    >*/}
            {/*      <Home />*/}
            {/*    </IconButton>*/}
            {/*  </span>*/}
            {/*</Tooltip>*/}
          </Grid>

          {/*<Grid item xs>*/}
          {/*  <PathParts*/}
          {/*    path={activePath}*/}
          {/*    onSelectPathPart={openDirectoryByPathPartIndex}*/}
          {/*  />*/}
          {/*</Grid>*/}

          <Grid item>
            <Tooltip title="Search files and directories">
              <IconButton
                onClick={() => setSearchMode(true)}
                color={"primary"}
                size={"large"}
              >
                <Search />
              </IconButton>
            </Tooltip>

            <FiltersSelector />
          </Grid>

          {/*<Grid item>*/}
          {/*  <FrameControlBar />*/}
          {/*</Grid>*/}
        </Grid>
      )}
      <FloatingFrameControlBar />
    </>
  )
}

export default FileBrowserTopbar
