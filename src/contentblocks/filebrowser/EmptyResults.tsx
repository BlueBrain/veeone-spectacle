import React from "react"
import { Button, IconButton, Tooltip } from "@mui/material"
import createStyles from "@mui/styles/createStyles"
import makeStyles from "@mui/styles/makeStyles"
import { useFileBrowser } from "./FileBrowserContext"
import { ArrowUpward } from "@mui/icons-material"
import { useFileBrowserSearch } from "./FileBrowserSearchContext"

const useStyles = makeStyles(theme =>
  createStyles({
    container: {
      width: "100%",
      display: "flex",
      justifyContent: "center",
      height: "100%",
      alignItems: "center",
      textAlign: "center",
    },
    searchQuery: {
      fontStyle: "italic",
    },
  })
)
const EmptyResults: React.FC = () => {
  const {
    nameFilterQuery,
    filterByName,
    totalFilesCount,
    hiddenFilesCount,
    displayAllHiddenFiles,
    navigateUp,
  } = useFileBrowser()

  const { searchQuery, searchMode, requestSearch } = useFileBrowserSearch()

  let message

  const classes = useStyles()

  const resetMySearchQuery = () => requestSearch("")
  const deactivateNameFiltering = () => filterByName("")
  const showAllFiles = () => displayAllHiddenFiles()
  const goToParentDirectory = () => navigateUp()

  if (!!searchQuery.length && searchMode) {
    message = (
      <div>
        {totalFilesCount > 0
          ? "Only hidden/unsupported files have been found"
          : "No search results could be found for the query"}
        <span className={classes.searchQuery}>`{searchQuery}`</span>
        <div>
          {totalFilesCount > 0 ? (
            <Button color="secondary" onClick={displayAllHiddenFiles}>
              Show all results
            </Button>
          ) : null}
          <Button color="secondary" onClick={resetMySearchQuery}>
            Reset my search
          </Button>
        </div>
      </div>
    )
  } else if (hiddenFilesCount && nameFilterQuery.length) {
    message = (
      <div>
        No files or directories can be displayed.
        <br />
        You have an active name filter that might exclude them.
        <div>
          <Button color="secondary" onClick={deactivateNameFiltering}>
            Deactivate name filter
          </Button>
        </div>
      </div>
    )
  } else if (hiddenFilesCount) {
    message = (
      <div>
        There are only hidden/unsupported files in this directory.
        <div>
          <Button color="secondary" onClick={showAllFiles}>
            Show all files
          </Button>
        </div>
      </div>
    )
  } else if (!totalFilesCount) {
    message = (
      <div>
        <Tooltip title="Move to the parent directory">
          <span>
            <IconButton onClick={goToParentDirectory} size="large">
              <ArrowUpward />
            </IconButton>
          </span>
        </Tooltip>
        <div>This directory is empty.</div>
      </div>
    )
  }

  return <div className={classes.container}>{message}</div>
}

export default EmptyResults
