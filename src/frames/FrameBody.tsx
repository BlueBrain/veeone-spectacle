import { Box } from "@mui/material"
import * as React from "react"
import { useInteractiveFrame } from "./useInteractiveFrame"
import { useFrame } from "./FrameContext"

const FrameBody: React.FC = () => {
  const {
    frameId,
    width,
    height,
    top,
    left,
    angle,
    isFullscreenAllowed,
    isMovingAllowed,
    isResizingAllowed,
    isResizingWithWheelAllowed,
    manipulate,
    toggleFullscreen,
    bringToFront,
    ContentBlockComponent,
    stackIndex,
    frameContentData,
  } = useFrame()

  const [frameRefReceiver] = useInteractiveFrame({
    width,
    height,
    left,
    top,
    angle,
    isFullscreenAllowed,
    isMovingAllowed,
    isResizingAllowed,
    isResizingWithWheelAllowed,
    manipulate,
    toggleFullscreen,
    bringToFront,
  })

  return (
    <Box
      ref={frameRefReceiver}
      sx={{
        position: "absolute",
        willChange: "transform",
        zIndex: stackIndex,
        width: `${width}px`,
        height: `${height}px`,
        transform: `translateZ(0) translateX(${left}px) translateY(${top}px) rotate(${angle}deg)`,
      }}
    >
      <ContentBlockComponent frameId={frameId} contentData={frameContentData} />
    </Box>
  )
}

export default FrameBody
