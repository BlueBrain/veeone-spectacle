import { Box, Grow } from "@mui/material"
import FloatingFrameControlBar from "../../frames/FloatingFrameControlBar"
import React from "react"
import { useWebsiteBlock } from "./WebsiteBlockContext"
import { useFrame } from "../../frames/FrameContext"

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
        }}
      >
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
            background: theme => theme.palette.primary.main,
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
                opacity: 0.5,
              },
            },
          }}
        />
        stackIndex={stackIndex}
        <FloatingFrameControlBar isFullscreenButtonVisible={false} />
      </Box>
    </Grow>
  )
}

export default WebsiteBlockContent
