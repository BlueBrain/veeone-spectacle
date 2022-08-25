import { FrameContext, FrameContextProps } from "./index"
import * as React from "react"
import { useCallback, useEffect, useMemo, useState } from "react"
import { useDispatch } from "react-redux"
import { useDesk } from "../desk/DeskContext"
import {
  bringFrameToFront,
  closeFrame,
  manipulateFrame,
  sendFrameToBack,
} from "../redux/actions"
import { FrameEntry, FrameId, FrameSituationUpdate } from "../types"
import { contentBlockRegister } from "../contentblocks/content-block-register"

interface FrameContextProviderProps {
  frame: FrameEntry
  frameId: FrameId
  stackIndex: number
}
const FrameContextProvider: React.FC<FrameContextProviderProps> = ({
  frameId,
  frame,
  stackIndex,
  children,
}) => {
  const dispatch = useDispatch()
  const { scene, setFullscreenFrame } = useDesk()
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

  const manipulate = useCallback(
    (newSituation: FrameSituationUpdate) => {
      dispatch(manipulateFrame(frameId, newSituation))
    },
    [dispatch, frameId]
  )

  const isTopFrame = useMemo(
    () => scene.frameStack.indexOf(frameId) === scene.frameStack.length - 1,
    [frameId, scene.frameStack]
  )

  const bringToFront = useCallback(
    event => {
      if (event?.double) {
        return
      }
      dispatch(bringFrameToFront(frameId))
    },
    [frameId, dispatch]
  )

  // Send frame contents to fullscreen layer
  const toggleFullscreen = useCallback(() => {
    const extraData = fullscreenParamsProvider && fullscreenParamsProvider()
    setFullscreenFrame({
      frameId,
      frame,
      extraData,
    })
  }, [frame, frameId, fullscreenParamsProvider, setFullscreenFrame])

  const updateAspectRatio = useCallback(
    (aspectRatio: number) => {
      console.debug("updateAspectRatio", aspectRatio)
      const newWidth = width
      const newHeight = width / aspectRatio
      manipulate({ width: newWidth, height: newHeight })
    },
    [manipulate, width]
  )

  const frameType = useMemo(() => frame.type, [frame.type])

  const ContentBlockComponent = useMemo(() => contentBlockRegister[frameType], [
    frameType,
  ])

  const frameContentData = frame.data

  useEffect(() => {
    console.debug("Frame size is", width, height)
    updateAspectRatio(width / height)
  }, [height, updateAspectRatio, width])

  const frameContextProvider: FrameContextProps = useMemo<FrameContextProps>(
    () => ({
      frameId,
      ContentBlockComponent,
      frameType,
      frameContentData,
      stackIndex,
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
      bringToFront,
      isTopFrame,
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
    [
      frameId,
      ContentBlockComponent,
      frameType,
      stackIndex,
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
      bringToFront,
      isTopFrame,
      updateAspectRatio,
      toggleFullscreen,
      dispatch,
    ]
  )

  return (
    <FrameContext.Provider value={frameContextProvider}>
      {children}
    </FrameContext.Provider>
  )
}

export default FrameContextProvider
