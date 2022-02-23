import React from "react"
import { Box, LinearProgress } from "@mui/material"
import { useFileBrowser } from "./FileBrowserContext"

const FileBrowserBackgroundProgressIndicator: React.FC = () => {
  const { isSearchingInProgress } = useFileBrowser()
  return (
    <Box
      sx={{
        width: "100%",
        height: 8,
      }}
    >
      {isSearchingInProgress ? <LinearProgress sx={{ height: 8 }} /> : null}
    </Box>
  )
}

export default FileBrowserBackgroundProgressIndicator
