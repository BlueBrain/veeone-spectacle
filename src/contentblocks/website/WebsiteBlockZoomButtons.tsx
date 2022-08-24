import { Box, IconButton, Tooltip } from "@mui/material"
import { ZoomIn, ZoomOut } from "@mui/icons-material"
import React from "react"
import { useWebsiteBlock } from "./WebsiteBlockContext"

const WebsiteBlockZoomButtons: React.FC = () => {
  const { zoomPageIn, zoomPageOut, zoomLevel } = useWebsiteBlock()

  return (
    <>
      <Tooltip title="Zoom out" enterDelay={1000}>
        <IconButton onClick={zoomPageOut}>
          <ZoomOut />
        </IconButton>
      </Tooltip>

      <Box sx={{ display: `flex`, alignItems: `center`, fontSize: `0.7rem` }}>
        {zoomLevel}%
      </Box>

      <Tooltip title="Zoom in" enterDelay={1000}>
        <IconButton onClick={zoomPageIn}>
          <ZoomIn />
        </IconButton>
      </Tooltip>
    </>
  )
}

export default WebsiteBlockZoomButtons
