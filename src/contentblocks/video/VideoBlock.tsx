import React, { useCallback, useContext } from "react"
import { ContentBlockProps } from "../types"
import { Box, Grow } from "@mui/material"
import VideoBlockContent from "./VideoBlockContent"
import { FrameContext } from "../../core/frames"
import FloatingFrameControlBar from "../../core/frames/FloatingFrameControlBar"

const VideoBlock: React.FC<ContentBlockProps> = ({ contentData }) => {
  const { updateAspectRatio, toggleFullscreen } = useContext(FrameContext)

  const handleVideoLoaded = useCallback(
    ({ width, height }) => {
      const aspectRatio = width / height
      updateAspectRatio(aspectRatio)
    },
    [updateAspectRatio]
  )

  return (
    <Grow in={true}>
      <Box
        data-drag-handle={true}
        sx={{
          background: "#000",
          width: "100%",
          height: "100%",
          boxShadow: 3,
        }}
      >
        <VideoBlockContent
          contentData={contentData}
          onFullscreenToggle={toggleFullscreen}
          onVideoLoaded={handleVideoLoaded}
        />
        <FloatingFrameControlBar />
      </Box>
    </Grow>
  )
}

export default VideoBlock
