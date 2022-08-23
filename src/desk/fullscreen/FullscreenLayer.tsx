import React, { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { Box, Theme } from "@mui/material"
import { SxProps } from "@mui/system"
import { useDesk } from "../DeskContext"
import interact from "interactjs"
import { ContentBlockTypes } from "../../contentblocks/types"
import ImageBlockContent from "../../contentblocks/image/ImageBlockContent"
import VideoBlockContent from "../../contentblocks/video/VideoBlockContent"
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
      console.debug("Fullscreen ON")
      setTimeout(() => (ref.current.style.opacity = 1), 0)
      setFullscreenDisplay("block")
    }
  }, [isFullscreenMode])

  const synchronizePlayback = useCallback(() => {
    const extraData = fullscreenFrame.extraData as FullscreenVideoExtraData
    console.debug(`Set playback to ${videoRef.current.currentTime}`)
    extraData.videoRef.currentTime = videoRef.current.currentTime
  }, [fullscreenFrame])

  const exitFullscreen = useCallback(() => {
    console.debug("exit fullscreen with", fullscreenFrame)

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
  }, [exitFullscreen, ref, setFullscreenFrame])

  const fullscreenContentComponent = useMemo(() => {
    let content = <Box>No content</Box>
    if (isFullscreenMode) {
      switch (fullscreenFrame.frame.type) {
        // Open image component in fullscreen
        case ContentBlockTypes.Image: {
          content = (
            <ImageBlockContent contentData={fullscreenFrame.frame.data} />
          )
          break
        }

        // Play video in fullscreen
        case ContentBlockTypes.Video: {
          const extraData = fullscreenFrame.extraData as FullscreenVideoExtraData
          content = (
            <VideoBlockContent
              ref={videoRef}
              contentData={fullscreenFrame.frame.data}
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
