import React, { useCallback, useEffect, useMemo, useRef } from "react"
import { Box, Theme } from "@mui/material"
import { SxProps } from "@mui/system"
import { useDesk } from "../DeskContext"
import interact from "interactjs"
import { ContentBlockTypes } from "../../../contentblocks/types"
import ImageBlockContent from "../../../contentblocks/image/ImageBlockContent"
import VideoBlockContent from "../../../contentblocks/video/VideoBlockContent"

const FullscreenLayer: React.FC = () => {
  const ref = useRef(null)

  const { fullscreenFrame, setFullscreenFrame } = useDesk()

  const isFullscreenMode = useMemo(() => Boolean(fullscreenFrame), [
    fullscreenFrame,
  ])

  const sx: SxProps<Theme> = {
    width: "100%",
    height: "100%",
    position: "fixed",
    left: 0,
    top: 0,
    background: `rgba(0, 0, 0, 1)`,
    color: "white",
    fontSize: "5rem",
    display: isFullscreenMode ? "block" : "none",
    zIndex: 99999,
  }

  const exitFullscreen = useCallback(() => {
    setFullscreenFrame(null)
  }, [setFullscreenFrame])

  useEffect(() => {
    console.debug("useEffect in fullscreen layer")
    const currentRef = ref.current
    if (currentRef) {
      console.debug("Append doubletap listener")
      interact(currentRef).on("doubletap", () => {
        console.debug("Exit fullscreen")
        exitFullscreen()
      })
    }
    return () => {
      interact(currentRef).unset()
      console.debug("Unset interact from fullscreen")
    }
  }, [ref, setFullscreenFrame])

  const fullscreenContentComponent = useMemo(() => {
    let content = <Box>No content</Box>
    if (isFullscreenMode) {
      switch (fullscreenFrame.type) {
        // Open image component in fullscreen
        case ContentBlockTypes.Image: {
          content = <ImageBlockContent contentData={fullscreenFrame.data} />
          break
        }

        // Play video in fullscreen
        case ContentBlockTypes.Video: {
          content = (
            <VideoBlockContent
              contentData={fullscreenFrame.data}
              onFullscreenToggle={exitFullscreen}
              // todo Video timelines should be synchronized
              startAt={0}
            />
          )
          break
        }
      }
    }
    return content
  }, [fullscreenFrame, isFullscreenMode])

  return (
    <Box sx={sx} ref={ref}>
      {fullscreenContentComponent}
    </Box>
  )
}

export default FullscreenLayer
