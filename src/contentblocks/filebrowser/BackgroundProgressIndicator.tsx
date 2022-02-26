import React from "react"
import { Box, LinearProgress } from "@mui/material"
import { useFileBrowserSearch } from "./FileBrowserSearchContext"

const BackgroundProgressIndicator: React.FC = () => {
  const { isSearchingInProgress, searchMode } = useFileBrowserSearch()
  const isProgressBarVisible = isSearchingInProgress && searchMode
  return (
    <Box
      sx={{
        display: "flex",
        width: "100%",
        height: 3,
      }}
    >
      {isProgressBarVisible ? (
        <LinearProgress sx={{ display: "flex", flexGrow: 1, height: 3 }} />
      ) : null}
    </Box>
  )
}

export default BackgroundProgressIndicator
