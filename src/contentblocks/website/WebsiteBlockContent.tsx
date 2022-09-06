import { Box, Grow } from "@mui/material"
import FloatingFrameControlBar from "../../frames/FloatingFrameControlBar"
import React, { useMemo, useRef } from "react"
import { useWebsiteBlock } from "./WebsiteBlockContext"
import WebsiteBlockNavigationBar from "./WebsiteBlockNavigationBar"
import WebsiteBlockPageArea from "./WebsiteBlockPageArea"
import { useFrame } from "../../frames/FrameContext"
import { white } from "../../branding/colors"

const WebsiteBlockContent: React.FC = () => {
  const { websiteUrl, isInteractiveModeOn } = useWebsiteBlock()
  const { isTopFrame } = useFrame()
  const navBarRef = useRef()
  console.debug("WebsiteBlockContent render", websiteUrl)

  const navBarTransform = useMemo(
    () =>
      isTopFrame || isInteractiveModeOn
        ? `translate(0, 0)`
        : navBarRef.current
        ? // @ts-ignore
          `translate(0, -${navBarRef.current.getBoundingClientRect().height}px)`
        : ``,
    [isInteractiveModeOn, isTopFrame]
  )

  const pageAreaMarginTop = useMemo(
    () =>
      isTopFrame || isInteractiveModeOn
        ? `0`
        : navBarRef.current
        ? // @ts-ignore
          `-${navBarRef.current.getBoundingClientRect().height}px`
        : ``,
    [isInteractiveModeOn, isTopFrame]
  )

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
          flexDirection: `column-reverse`,
          overflow: `hidden`,
        }}
      >
        <Box
          sx={{
            position: `relative`,
            flexGrow: 1,
            width: `100%`,
            height: `100%`,
            transition: `all ease 300ms`,
            marginTop: pageAreaMarginTop,
          }}
        >
          <WebsiteBlockPageArea />
        </Box>
        <Box
          ref={navBarRef}
          sx={{
            background: white,
            transition: `all ease 300ms`,
            transform: navBarTransform,
            boxShadow: 1,
          }}
        >
          <WebsiteBlockNavigationBar />
        </Box>
        <FloatingFrameControlBar isFullscreenButtonVisible={false} />
      </Box>
    </Grow>
  )
}

export default WebsiteBlockContent
