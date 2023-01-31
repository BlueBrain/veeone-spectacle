import React, { useCallback, useContext, useEffect, useRef } from "react"
import { Box, Grow } from "@mui/material"
import VideoBlockContent, { VideoBlockParams } from "./VideoBlockContent"
import { FrameContext } from "../../frames"
import FloatingFrameControlBar from "../../frames/FloatingFrameControlBar"
import { useFrame } from "../../frames/FrameContext"

const VideoBlock: React.FC = () => {
  const { frameContentData } = useFrame()
  const videoRef = useRef<HTMLVideoElement>(null)

  const {
    updateAspectRatio,
    toggleFullscreen,
    setFullscreenParamsProvider,
  } = useContext(FrameContext)

  const handleVideoLoaded = useCallback(
    ({ width, height }) => {
      const aspectRatio = width / height
      updateAspectRatio(aspectRatio)
    },
    [updateAspectRatio]
  )

  // Set what happens if this frame goes fullscreen (we need to pass the timeline to synchronize)
  useEffect(() => {
    const currentVideoRef = videoRef.current
    if (currentVideoRef) {
      setFullscreenParamsProvider(() => () => {
        return {
          videoRef: currentVideoRef,
        }
      })
    }
  }, [setFullscreenParamsProvider])

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
          contentData={(frameContentData as unknown) as VideoBlockParams}
          ref={videoRef}
          onFullscreenToggle={toggleFullscreen}
          onVideoLoaded={handleVideoLoaded}
        />
        <FloatingFrameControlBar />
      </Box>
    </Grow>
  )
}

export default VideoBlock
