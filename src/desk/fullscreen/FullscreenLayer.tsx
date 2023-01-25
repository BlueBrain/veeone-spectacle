import React, { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { Box, Theme } from "@mui/material"
import { SxProps } from "@mui/system"
import { useDesk } from "../DeskContext"
import interact from "interactjs"
import { ContentBlockTypes } from "../../contentblocks/types"
import ImageBlockContent, {
  ImageBlockParams,
} from "../../contentblocks/image/ImageBlockContent"
import VideoBlockContent, {
  VideoBlockParams,
} from "../../contentblocks/video/VideoBlockContent"
import { useConfig } from "../../config/AppConfigContext"

interface FullscreenVideoExtraData {
  videoRef: HTMLVideoElement
}

const FullscreenLayer: React.FC = () => {
  const config = useConfig()
  const ref = useRef(null)
  const videoRef = useRef(null)

  const { fullscreenFrame, setFullscreenFrame } = useDesk()

  const isFullscreenMode = useMemo(() => Boolean(fullscreenFrame), [
    fullscreenFrame,
  ])

  const [fullscreenDisplay, setFullscreenDisplay] = useState("none")

  const sx: SxProps<Theme> = {
    width: "100%",
    height: "100%",
    position: "fixed",
    left: 0,
    top: 0,
    background: `rgba(0, 0, 0, 1)`,
    color: "white",
    fontSize: "5rem",
    display: fullscreenDisplay,
    zIndex: 99999,
    transition: `opacity ease ${config.FULLSCREEN_TRANSITION_MS}ms`,
    opacity: 0,
  }

  useEffect(() => {
    if (isFullscreenMode) {
      setTimeout(() => (ref.current.style.opacity = 1), 0)
      setFullscreenDisplay("block")
    }
  }, [isFullscreenMode])

  const synchronizePlayback = useCallback(() => {
    const extraData = fullscreenFrame.extraData as FullscreenVideoExtraData
    extraData.videoRef.currentTime = videoRef.current.currentTime
  }, [fullscreenFrame])

  const exitFullscreen = useCallback(() => {
    if (fullscreenFrame.frame.type === ContentBlockTypes.Video) {
      synchronizePlayback()
    }

    ref.current.style.opacity = 0
    setTimeout(() => {
      setFullscreenDisplay("none")
      setFullscreenFrame(null)
    }, config.FULLSCREEN_TRANSITION_MS)
  }, [
    config.FULLSCREEN_TRANSITION_MS,
    fullscreenFrame,
    setFullscreenFrame,
    synchronizePlayback,
  ])

  useEffect(() => {
    const currentRef = ref.current
    if (currentRef) {
      interact(currentRef).on("doubletap", () => {
        exitFullscreen()
      })
    }
    return () => {
      interact(currentRef).unset()
    }
  }, [exitFullscreen, ref, setFullscreenFrame])

  const fullscreenContentComponent = useMemo(() => {
    let content = <Box>No content</Box>
    if (isFullscreenMode) {
      switch (fullscreenFrame.frame.type) {
        // Open image component in fullscreen
        case ContentBlockTypes.Image: {
          content = (
            <ImageBlockContent
              contentData={
                (fullscreenFrame.frame.data as unknown) as ImageBlockParams
              }
            />
          )
          break
        }

        // Play video in fullscreen
        case ContentBlockTypes.Video: {
          const extraData = fullscreenFrame.extraData as FullscreenVideoExtraData
          content = (
            <VideoBlockContent
              ref={videoRef}
              contentData={
                (fullscreenFrame.frame.data as unknown) as VideoBlockParams
              }
              onFullscreenToggle={exitFullscreen}
              startAt={extraData.videoRef.currentTime}
              allowPlayingInFullscreenMode={true}
            />
          )
          break
        }
      }
    }
    return content
  }, [exitFullscreen, fullscreenFrame, isFullscreenMode])

  return (
    <Box sx={sx} ref={ref}>
      {fullscreenContentComponent}
    </Box>
  )
}

export default FullscreenLayer
