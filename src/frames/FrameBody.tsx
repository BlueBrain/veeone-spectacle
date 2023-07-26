import { Box } from "@mui/material"
import * as React from "react"
import { useInteractiveFrame } from "./useInteractiveFrame"
import { useFrame } from "./FrameContext"
import { useSpectacle } from "../spectacle/SpectacleStateContext"

const FrameBody: React.FC = () => {
  const {
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
  } = useFrame()

  const { viewZoomPercent } = useSpectacle()

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
    viewZoomPercent,
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
      <ContentBlockComponent />
    </Box>
  )
}

export default FrameBody
