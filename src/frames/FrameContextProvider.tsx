import { FrameContext, FrameContextProps } from "./index"
import * as React from "react"
import { useCallback, useEffect, useMemo, useState } from "react"
import { useDesk } from "../desk/DeskContext"
import { FrameEntry, FrameId, FrameSituationUpdate } from "../types"
import { contentBlockRegister } from "../contentblocks/content-block-register"
import { useScenes } from "../scenes/SceneContext"
import { useSpectacle } from "../spectacle/SpectacleStateContext"

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
  const { setFullscreenFrame } = useDesk()
  const { activeScene } = useScenes()
  const {
    manipulateFrame,
    bringFrameToFront,
    closeFrame,
    sendFrameToBack,
  } = useSpectacle()
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
    (situationUpdate: FrameSituationUpdate) => {
      manipulateFrame({ frameId, situationUpdate })
    },
    [manipulateFrame, frameId]
  )

  const isTopFrame = useMemo(
    () =>
      activeScene.frameStack.indexOf(frameId) ===
      activeScene.frameStack.length - 1,
    [frameId, activeScene.frameStack]
  )

  const bringToFront = useCallback(
    event => {
      if (event?.double) {
        return
      }
      bringFrameToFront({ frameId })
    },
    [bringFrameToFront, frameId]
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
        closeFrame({ frameId })
      },
      sendToBack: async () => {
        sendFrameToBack({ frameId })
      },
      setFullscreenParamsProvider,
    }),
    [
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
      toggleFullscreen,
      closeFrame,
      sendFrameToBack,
    ]
  )

  return (
    <FrameContext.Provider value={frameContextProvider}>
      {children}
    </FrameContext.Provider>
  )
}

export default FrameContextProvider
