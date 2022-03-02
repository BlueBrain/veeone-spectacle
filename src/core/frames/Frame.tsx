import * as React from "react"
import { useCallback, useMemo, useState } from "react"
import "@interactjs/modifiers"
import { useDispatch } from "react-redux"
import {
  bringFrameToFront,
  closeFrame,
  manipulateFrame,
  sendFrameToBack,
} from "../redux/actions"
import { FrameEntry, FrameId, FrameSituationUpdate } from "../types"
import { contentBlockRegister } from "../../contentblocks/content-block-register"
import { FrameContextProps } from "./types"
import { FrameContext } from "./index"
import { useInteractiveFrame } from "./useInteractiveFrame"
import { Box } from "@mui/material"

interface FrameProps {
  frame: FrameEntry
  frameId: FrameId
  stackIndex: number
}

const Frame: React.FC<FrameProps> = ({ frameId, frame, stackIndex }) => {
  const dispatch = useDispatch()
  const { width, height, left, top, angle, isFullscreen } = frame.situation
  const [isMovingAllowed, setMovingAllowed] = useState(true)
  const [isResizingAllowed, setResizingAllowed] = useState(true)
  const [isResizingWithWheelAllowed, setResizingWithWheelAllowed] = useState(
    true
  )
  const [isFullscreenAllowed, setFullscreenAllowed] = useState(true)

  const bringToFront = useCallback(() => dispatch(bringFrameToFront(frameId)), [
    frameId,
    dispatch,
  ])

  const manipulate = useCallback(
    (newSituation: FrameSituationUpdate) => {
      dispatch(manipulateFrame(frameId, newSituation))
    },
    [dispatch, frameId]
  )

  const toggleFullscreen = useCallback(() => {
    const data = { isFullscreen: !isFullscreen }
    manipulate(data)
  }, [manipulate, isFullscreen])

  const [frameRefReceiver] = useInteractiveFrame({
    width,
    height,
    left,
    top,
    angle,
    isFullscreenAllowed,
    isFullscreen,
    isMovingAllowed,
    isResizingAllowed,
    isResizingWithWheelAllowed,
    manipulate,
    toggleFullscreen,
    bringToFront,
  })

  const frameContentData = frame.data

  const frameContextProvider: FrameContextProps = useMemo(
    () => ({
      frameId,
      updateAspectRatio: (aspectRatio: number) => {
        const newWidth = width
        const newHeight = width / aspectRatio
        manipulate({ width: newWidth, height: newHeight })
      },
      preventResizing: () => {
        setResizingAllowed(false)
      },
      preventResizingWithWheel: () => {
        setResizingWithWheelAllowed(false)
      },
      preventMoving: () => {
        setMovingAllowed(false)
      },
      preventFullscreen: () => {
        console.debug("Prevent fullscreen")
        setFullscreenAllowed(false)
      },
      toggleFullscreen: async () => {
        toggleFullscreen()
      },
      close: async () => {
        dispatch(closeFrame(frameId))
      },
      sendToBack: async () => {
        dispatch(sendFrameToBack(frameId))
      },
    }),
    [width, manipulate, toggleFullscreen, dispatch, frameId]
  )

  const ContentBlockComponent = useMemo(
    () => contentBlockRegister[frame.type],
    [frame.type]
  )

  return (
    <Box
      ref={frameRefReceiver}
      sx={{
        position: "absolute",
        willChange: "transform",
        zIndex: stackIndex,
        width: isFullscreen ? `100% !important` : `${width}px`,
        height: isFullscreen ? `100% !important` : `${height}px`,
        transform: isFullscreen
          ? `translateX(0) translateY(0) translateZ(0) !important`
          : `translateZ(0) translateX(${left}px) translateY(${top}px) rotate(${angle}deg)`,
      }}
    >
      <FrameContext.Provider value={frameContextProvider}>
        <ContentBlockComponent
          frameId={frameId}
          contentData={frameContentData}
        />
      </FrameContext.Provider>
    </Box>
  )
}

export default Frame
