import * as React from "react"
import { useCallback, useEffect, useMemo, useState } from "react"
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
import { useDesk } from "../desk/DeskContext"

interface FrameProps {
  frame: FrameEntry
  frameId: FrameId
  stackIndex: number
}

const Frame: React.FC<FrameProps> = ({ frameId, frame, stackIndex }) => {
  const dispatch = useDispatch()
  const { setFullscreenFrame } = useDesk()
  const { width, height, left, top, angle } = frame.situation
  const [isMovingAllowed, setMovingAllowed] = useState(true)
  const [isResizingAllowed, setResizingAllowed] = useState(true)
  const [isResizingWithWheelAllowed, setResizingWithWheelAllowed] = useState(
    true
  )
  const [isFullscreenAllowed, setFullscreenAllowed] = useState(true)
  const [
    fullscreenParamsProvider,
    setFullscreenParamsProvider,
  ] = useState<Function | null>(null)

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

  // Send frame contents to fullscreen layer
  const toggleFullscreen = useCallback(() => {
    const extraData = fullscreenParamsProvider && fullscreenParamsProvider()
    const fullscreenFrame = {
      frame,
      extraData,
    }
    setFullscreenFrame(fullscreenFrame)
  }, [frame, fullscreenParamsProvider, setFullscreenFrame])

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

  const frameContentData = frame.data

  const updateAspectRatio = useCallback(
    (aspectRatio: number) => {
      console.debug("updateAspectRatio", aspectRatio)
      const newWidth = width
      const newHeight = width / aspectRatio
      manipulate({ width: newWidth, height: newHeight })
    },
    [manipulate, width]
  )

  const frameContextProvider: FrameContextProps = useMemo(
    () => ({
      frameId,
      updateAspectRatio,
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
      setFullscreenParamsProvider,
    }),
    [frameId, updateAspectRatio, toggleFullscreen, dispatch]
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
        width: `${width}px`,
        height: `${height}px`,
        transform: `translateZ(0) translateX(${left}px) translateY(${top}px) rotate(${angle}deg)`,
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
