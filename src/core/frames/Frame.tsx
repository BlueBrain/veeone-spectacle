import * as React from "react"
import { useCallback, useMemo, useRef, useState } from "react"
import "@interactjs/modifiers"
import interact from "interactjs"
import { useDispatch } from "react-redux"
import {
  bringFrameToFront,
  closeFrame,
  manipulateFrame,
  sendFrameToBack,
} from "../redux/actions"
import {
  FrameEntry,
  FrameId,
  FrameSituation,
  FrameSituationUpdate,
} from "../scenes/interfaces"
import styled from "styled-components"
import { GestureEvent } from "@interactjs/types"
import { contentBlockRegister } from "../../contentblocks/content-block-register"
import { FrameContextProps } from "./types"
import { FrameContext } from "./index"
import { Situation } from "../../common/types"
import { config } from "../../config"
import { debounce } from "lodash"

interface FrameProps {
  frame: FrameEntry
  frameId: FrameId
  stackIndex: number
}

const isFrameTooSmall = (width, height) => {
  return Math.max(width, height) < config.MINIMUM_FRAME_LONG_SIDE
}

const isFrameTooBig = (width, height) => {
  // todo implement it
  return false
}

const StyledFrame = styled.div(
  ({ isFullscreen, width, height, left, top, angle, stackIndex }) => `
  position: absolute;
  will-change: transform;
  z-index: ${stackIndex};
  width: ${isFullscreen ? `100% !important` : `${width}px`};
  height: ${isFullscreen ? `100% !important` : `${height}px`};
  transform: ${
    isFullscreen
      ? `translateX(0) translateY(0) translateZ(0) !important`
      : `translateZ(0) translateX(${left}px) translateY(${top}px) rotate(${angle}deg)`
  }
`
)

interface UseInteractJsProps {
  angle
  width
  height
  left
  top
  isMovingAllowed
  isResizingAllowed
  isResizingWithWheelAllowed
  isFullscreenAllowed
  isFullscreen
  bringToFront
  manipulate: (newSituation: FrameSituationUpdate) => void
  toggleFullscreen
}

const useInteractWithFrame = ({
  angle,
  width,
  height,
  left,
  top,
  isMovingAllowed,
  isResizingAllowed,
  isResizingWithWheelAllowed,
  isFullscreenAllowed,
  isFullscreen,
  bringToFront,
  manipulate,
  toggleFullscreen,
}: UseInteractJsProps) => {
  const frameRef = useRef(null)
  const debouncedManipulate = useMemo(
    () => debounce((situation: Situation) => manipulate(situation), 200),
    [manipulate]
  )
  const frameRefReceiver = useCallback(
    node => {
      if (frameRef.current) {
        interact(frameRef.current).unset()
      }

      if (node) {
        let nodeLeft = left
        let nodeTop = top
        let nodeWidth = width
        let nodeHeight = height
        let nodeAngle = angle
        let aspectRatio = width / height
        let fingerAngleOffset = 0
        let gesturableStart: FrameSituation
        let resizeByWidth = null

        const interactiveNode = interact(node)

        if (isFullscreenAllowed) {
          interactiveNode.on("doubletap", () => {
            console.debug("Double tap detected")
            toggleFullscreen()
          })
        }

        interactiveNode.on("tap", bringToFront)

        if (
          isResizingAllowed &&
          isResizingWithWheelAllowed &&
          config.ALLOW_SCALE_WITH_MOUSEWHEEL
        ) {
          interactiveNode.on("mousewheel", event => {
            event.preventDefault()
            event.stopPropagation()
            if (isFullscreen || !isResizingAllowed) {
              return
            }
            if (node !== null) {
              let diffHorizontal = Math.min(
                Math.max(-200, -event.deltaY * 2),
                200
              )
              let scale = diffHorizontal / width
              let diffVertical = scale * height

              nodeWidth += diffHorizontal
              nodeHeight += diffVertical

              if (isFrameTooSmall(nodeWidth, nodeHeight)) {
                if (aspectRatio >= 1) {
                  diffHorizontal -= nodeWidth - config.MINIMUM_FRAME_LONG_SIDE
                  nodeWidth = config.MINIMUM_FRAME_LONG_SIDE
                  nodeHeight = nodeWidth / aspectRatio
                } else {
                  nodeHeight = config.MINIMUM_FRAME_LONG_SIDE
                  diffHorizontal -= nodeWidth - nodeHeight * aspectRatio
                  nodeWidth = nodeHeight * aspectRatio
                }
              }

              scale = diffHorizontal / nodeWidth
              diffVertical = scale * nodeHeight

              nodeLeft -= diffHorizontal / 2
              nodeTop -= diffVertical / 2

              node.style.transform = `
                      translateX(${nodeLeft}px)
                      translateY(${nodeTop}px)
                      rotate(${angle}deg)`
              node.style.width = `${nodeWidth}px`
              node.style.height = `${nodeHeight}px`
              debouncedManipulate({
                width: nodeWidth,
                height: nodeHeight,
                left: nodeLeft,
                top: nodeTop,
              })
            }
          })
        }

        interactiveNode.draggable({
          enabled: isMovingAllowed,
          allowFrom: "[data-drag-handle]",
          inertia: {
            resistance: 8,
          },
          modifiers: [
            interact.modifiers.restrictRect({
              restriction: "parent",
              endOnly: true,
            }),
          ],
          onstart: event => {
            node.style.zIndex = "9999"
            nodeLeft = left
            nodeTop = top
          },
          onmove: event => {
            const { dx, dy } = event
            nodeLeft += dx
            nodeTop += dy
            node.style.transform = `
              translateX(${nodeLeft}px)
              translateY(${nodeTop}px)
              rotate(${angle}deg)`
            node.style.width = `${nodeWidth}px`
            node.style.height = `${nodeHeight}px`
          },
          onend: () => {
            bringToFront()
            manipulate({ left: nodeLeft, top: nodeTop })
            node.style.transform = ``
            node.style.width = ``
            node.style.height = ``
            node.style.zIndex = ``
          },
        })

        interactiveNode.resizable({
          enabled: isResizingAllowed,
          edges: {
            left: true,
            right: true,
            bottom: true,
            top: true,
          },
          invert: "reposition",
          onmove: event => {
            const aspectRatio = nodeWidth / nodeHeight
            const { width: rectWidth, height: rectHeight } = event.rect
            const {
              left: deltaLeft,
              top: deltaTop,
              width: deltaWidth,
            } = event.deltaRect
            if (resizeByWidth === null) {
              resizeByWidth = deltaWidth !== 0
            }
            if (resizeByWidth) {
              nodeWidth = rectWidth
              nodeHeight = nodeWidth / aspectRatio
            } else {
              nodeHeight = rectHeight
              nodeWidth = nodeHeight * aspectRatio
            }
            nodeLeft += deltaLeft
            nodeTop += deltaTop
            node.style.transform = `
              translateX(${nodeLeft}px)
              translateY(${nodeTop}px)
              rotate(${angle}deg)`
            node.style.width = `${nodeWidth}px`
            node.style.height = `${nodeHeight}px`
            debouncedManipulate({
              left: nodeLeft,
              top: nodeTop,
              width: nodeWidth,
              height: nodeHeight,
            })
          },
          onend: () => {
            node.style.transform = ``
            node.style.width = ``
            node.style.height = ``
            node.style.zIndex = ``
          },
        })

        interactiveNode.gesturable({
          enabled: isResizingAllowed,
          onstart: event => {
            fingerAngleOffset = event.angle - angle
            gesturableStart = {
              left,
              top,
              width,
              height,
              angle,
              disableWheelScaling: false,
            }
          },
          onmove: (event: GestureEvent) => {
            const newWidth = gesturableStart.width * event.scale
            const newHeight = gesturableStart.height * event.scale
            nodeLeft += (nodeWidth - newWidth) / 2
            nodeTop += (nodeHeight - newHeight) / 2
            nodeWidth = newWidth
            nodeHeight = newHeight
            node.style.transform = `
              translateX(${nodeLeft}px)
              translateY(${nodeTop}px)
              rotate(${nodeAngle}deg)`
            node.style.width = `${nodeWidth}px`
            node.style.height = `${nodeHeight}px`
            debouncedManipulate({
              width: nodeWidth,
              height: nodeHeight,
              left: nodeLeft,
              top: nodeTop,
            })
          },
          onend: () => {
            node.style.transform = ``
            node.style.width = ``
            node.style.height = ``
            node.style.zIndex = ``
          },
        })
      }
      frameRef.current = node
      return frameRef
    },
    [
      left,
      top,
      width,
      height,
      angle,
      isFullscreenAllowed,
      bringToFront,
      isResizingAllowed,
      isResizingWithWheelAllowed,
      isMovingAllowed,
      toggleFullscreen,
      isFullscreen,
      debouncedManipulate,
      manipulate,
    ]
  )
  return [frameRefReceiver]
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

  const [frameRefReceiver] = useInteractWithFrame({
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
    <StyledFrame
      ref={frameRefReceiver}
      isFullscreen={isFullscreen}
      width={width}
      height={height}
      left={left}
      top={top}
      stackIndex={stackIndex}
      angle={angle}
    >
      <FrameContext.Provider value={frameContextProvider}>
        <ContentBlockComponent
          frameId={frameId}
          contentData={frameContentData}
        />
      </FrameContext.Provider>
    </StyledFrame>
  )
}

export default Frame
