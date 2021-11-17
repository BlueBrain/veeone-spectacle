import React, { useContext } from "react"
import { Box, LinearProgress } from "@mui/material"
import { FileBrowserContext } from "./FileBrowserContext"

const FileBrowserBackgroundProgressIndicator: React.FC = () => {
  const { isSearchingInProgress } = useContext(FileBrowserContext)
  return (
    <Box
      sx={{
        width: "100%",
        height: 8,
        position: "absolute",
        bottom: 0,
        left: 0,
      }}
    >
      {isSearchingInProgress ? <LinearProgress sx={{ height: 8 }} /> : null}
    </Box>
  )
}

export default FileBrowserBackgroundProgressIndicator
