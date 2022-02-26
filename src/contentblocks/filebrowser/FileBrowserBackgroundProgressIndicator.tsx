import React from "react"
import { Box, LinearProgress } from "@mui/material"
import { useFileBrowserSearch } from "./FileBrowserSearchContext"

const FileBrowserBackgroundProgressIndicator: React.FC = () => {
  const { isSearchingInProgress, searchMode } = useFileBrowserSearch()
  return (
    <Box
      sx={{
        display: "flex",
        width: "100%",
        height: 5,
      }}
    >
      {isSearchingInProgress && searchMode ? (
        <LinearProgress sx={{ height: 5 }} />
      ) : null}
    </Box>
  )
}

export default FileBrowserBackgroundProgressIndicator
