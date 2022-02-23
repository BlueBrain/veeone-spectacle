import React from "react"
import { Box, LinearProgress } from "@mui/material"
import { useFileBrowserSearch } from "./FileBrowserSearchContext"

const FileBrowserBackgroundProgressIndicator: React.FC = () => {
  const { isSearchingInProgress, searchMode } = useFileBrowserSearch()
  return (
    <Box
      sx={{
        width: "100%",
        height: 8,
      }}
    >
      {isSearchingInProgress && searchMode ? (
        <LinearProgress sx={{ height: 8 }} />
      ) : null}
    </Box>
  )
}

export default FileBrowserBackgroundProgressIndicator
