import { Box, Grow } from "@mui/material"
import FloatingFrameControlBar from "../../frames/FloatingFrameControlBar"
import React, { useState } from "react"
import { useWebsiteBlock } from "./WebsiteBlockContext"
import { useFrame } from "../../frames/FrameContext"
import WebsiteBlockNavigationBar from "./WebsiteBlockNavigationBar"
import WebsiteBlockPageArea from "./WebsiteBlockPageArea"

const WebsiteBlockContent: React.FC = () => {
  const { websiteUrl } = useWebsiteBlock()
  const { frameId, isTopFrame, stackIndex } = useFrame()

  console.debug("WebsiteBlockContent render", websiteUrl)

  return (
    <Grow in={true}>
      <Box
        data-drag-handle={true}
        sx={{
          width: "100%",
          height: "100%",
          background: "white",
          boxShadow: 3,
          display: `flex`,
          flexDirection: `column`,
        }}
      >
        <Box>
          <WebsiteBlockNavigationBar />
        </Box>
        <Box sx={{ position: `relative`, flexGrow: 1 }}>
          <WebsiteBlockPageArea />
        </Box>
        <FloatingFrameControlBar isFullscreenButtonVisible={false} />
      </Box>
    </Grow>
  )
}

export default WebsiteBlockContent
