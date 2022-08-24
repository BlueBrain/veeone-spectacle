import { alpha, Box, Button } from "@mui/material"
import React, { useMemo, useRef } from "react"
import { useWebsiteBlock } from "./WebsiteBlockContext"
import { useFrame } from "../../frames/FrameContext"
import { LockOpenRounded } from "@mui/icons-material"
import { black } from "../../branding/colors"
import WebsiteBlockLockSwitch from "./WebsiteBlockLockSwitch"

const WebsiteBlockPageArea = () => {
  const iframeRef = useRef()
  const {
    websiteUrl,
    isInteractiveModeOn,
    activateInteractiveMode,
    zoomLevel,
    websiteIframeKey,
  } = useWebsiteBlock()
  const { frameId, isTopFrame } = useFrame()

  const iframeSx = useMemo(() => {
    const sizePercent = 100 * (100 / zoomLevel)
    const translate = (100 - sizePercent) / 2
    const scale = 100 * (100 / sizePercent)
    return {
      width: `${sizePercent}%`,
      height: `${sizePercent}%`,
      transform: `scale(${scale}%) translate(${translate}%, ${translate}%)`,
    }
  }, [zoomLevel])

  return (
    <>
      <Box
        component="iframe"
        sx={{
          display: `flex`,
          border: `0`,
          ...iframeSx,
        }}
        title={"EPFL"}
        src={websiteUrl}
        allowFullScreen={false}
        ref={iframeRef}
        key={websiteIframeKey}
      />
      <Box
        sx={{
          background: theme => alpha(black, 0.5),
          display: isInteractiveModeOn ? `none` : `block`,
          opacity: `0.0`,
          width: `100%`,
          height: `100%`,
          position: `absolute`,
          left: `0`,
          top: `0`,
          animation: isTopFrame
            ? `showWebsiteOverlay${frameId} 500ms ease forwards`
            : ``,
          ["@keyframes showWebsiteOverlay" + frameId]: {
            "0%": {
              opacity: 0.0,
            },
            "100%": {
              opacity: 1,
            },
          },
        }}
      >
        <Box
          sx={{
            color: `white`,
            position: `absolute`,
            left: `50%`,
            top: `40%`,
            transform: `translate(-50%, -50%)`,
            textAlign: `center`,
          }}
        >
          <Button variant={"contained"} onClick={activateInteractiveMode}>
            <LockOpenRounded sx={{ margin: `0 0.5rem 0 0` }} />
            Unlock
          </Button>
        </Box>
      </Box>
    </>
  )
}

export default WebsiteBlockPageArea
