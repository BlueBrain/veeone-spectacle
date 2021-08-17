import React, { useContext } from "react"
import { Button, createStyles, makeStyles } from "@material-ui/core"
import { FileBrowserContext } from "../../contexts/FileBrowserContext"
const useStyles = makeStyles(theme =>
  createStyles({
    container: {
      width: "100%",
      display: "flex",
      justifyContent: "center",
      height: "100%",
      alignItems: "center",
    },
    searchQuery: {
      fontStyle: "italic",
    },
  })
)
const EmptyResults: React.FC = () => {
  const {
    nameFilterQuery,
    searchQuery,
    searchModeOn,
    requestSearch,
    filterByName,
    totalFilesCount,
    hiddenFilesCount,
    displayAllHiddenFiles,
  } = useContext(FileBrowserContext)
  let message

  const classes = useStyles()

  const resetMySearchQuery = () => requestSearch("")
  const deactivateNameFiltering = () => filterByName("")
  const showAllFiles = () => displayAllHiddenFiles()

  if (!!searchQuery.length && searchModeOn) {
    message = (
      <div>
        No search results could be found for the query{" "}
        <span className={classes.searchQuery}>`{searchQuery}`</span>
        <div>
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
    message = "This directory is empty."
  }

  return <div className={classes.container}>{message}</div>
}

export default EmptyResults
