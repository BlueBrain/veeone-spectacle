import { alpha, Box, Button } from "@mui/material"
import React from "react"
import { useWebsiteBlock } from "./WebsiteBlockContext"
import { useFrame } from "../../frames/FrameContext"
import { LockOpenRounded } from "@mui/icons-material"
import { black } from "../../branding/colors"

const WebsiteBlockPageArea = () => {
  const {
    websiteUrl,
    isInteractiveModeOn,
    activateInteractiveMode,
  } = useWebsiteBlock()
  const { frameId, isTopFrame, stackIndex } = useFrame()
  // todo display warning only if tapped by user

  return (
    <>
      <Box
        component="iframe"
        sx={{
          width: `100%`,
          height: `100%`,
          display: `flex`,
          border: `0`,
        }}
        title={"EPFL"}
        src={websiteUrl}
        allowFullScreen={false}
        sandbox={"allow-same-origin allow-scripts"}
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
          <Box sx={{ fontSize: `1rem`, fontWeight: `600`, margin: `1rem 0` }}>
            Page interaction is locked
          </Box>
          <Button variant={"contained"} onClick={activateInteractiveMode}>
            <LockOpenRounded sx={{ margin: `0 0.5rem 0 0` }} />
            Unlock it
          </Button>
        </Box>
      </Box>
    </>
  )
}

export default WebsiteBlockPageArea
