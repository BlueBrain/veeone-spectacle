import * as React from "react"
import { useCallback, useMemo, useRef, useState } from "react"
import "@interactjs/modifiers"
import interact from "interactjs"
import { useDispatch } from "react-redux"
import {
  bringFrameToFront,
  closeFrame,
  manipulateFrame,
} from "../redux/actions"
import {
  FrameEntry,
  FrameId,
  FrameSituation,
  FrameSituationUpdate,
} from "../scenes/interfaces"
import styled from "styled-components"
import FrameControlBar from "./FrameControlBar"
import { GestureEvent } from "@interactjs/types"
import { contentBlockRegister } from "../../contentblocks/content-block-register"
import { FrameContextProps } from "./types"
import { FrameContext } from "./index"
import _ from "lodash"

interface FrameProps {
  frame: FrameEntry
  frameId: FrameId
  stackIndex: number
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
  isFullscreenAllowed
  isFullscreen
  bringToFront
  manipulate: (newSituation: FrameSituationUpdate) => void
  toggleFullscreen
}

const useInteractJs = ({
  angle,
  width,
  height,
  left,
  top,
  isMovingAllowed,
  isResizingAllowed,
  isFullscreenAllowed,
  isFullscreen,
  bringToFront,
  manipulate,
  toggleFullscreen,
}: UseInteractJsProps) => {
  const frameRef = useRef(null)
  const frameRefReceiver = useCallback(
    node => {
      if (frameRef.current) {
        // console.debug("frameRef.current is already set")
        interact(frameRef.current).unset()
      }

      if (node) {
        let nodeLeft = left
        let nodeTop = top
        let nodeWidth = width
        let nodeHeight = height
        let nodeAngle = angle
        let fingerAngleOffset = 0
        let gesturableStart: FrameSituation
        let resizeByWidth = null

        // console.debug("Assign interactjs events to the node", node)

        if (isFullscreenAllowed) {
          interact(node).on("doubletap", () => {
            console.debug("Double tap detected")
            toggleFullscreen()
          })
        }

        interact(node).on("mousewheel", event => {
          if (isFullscreen || !isResizingAllowed) {
            return
          }
          const diff = -event.deltaY * 2
          const scale = diff / width
          if (
            node !== null &&
            (diff > 0 || (diff < 0 && (nodeWidth > 300 || nodeHeight > 300)))
          ) {
            nodeWidth += diff
            nodeHeight += scale * height
            nodeLeft -= diff / 2
            nodeTop -= diff / 2
            node.style.transform = `
                      translateX(${nodeLeft}px)
                      translateY(${nodeTop}px)
                      rotate(${angle}deg)`
            node.style.width = `${nodeWidth}px`
            node.style.height = `${nodeHeight}px`
            manipulate({
              width: nodeWidth,
              height: nodeHeight,
              left: nodeLeft,
              top: nodeTop,
            })
          }
          event.stopImmediatePropagation()
        })

        interact(node).draggable({
          enabled: isMovingAllowed,
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
            event.target.addEventListener(
              "click",
              event => event.stopImmediatePropagation(),
              { capture: true, once: true }
            )
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
            manipulate({ left: nodeLeft, top: nodeTop })
            bringToFront()
            node.style.transform = ``
            node.style.width = ``
            node.style.height = ``
            node.style.zIndex = ``
          },
        })

        interact(node).resizable({
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
          },
          onend: () => {
            manipulate({
              left: nodeLeft,
              top: nodeTop,
              width: nodeWidth,
              height: nodeHeight,
            })
            node.style.transform = ``
            node.style.width = ``
            node.style.height = ``
            node.style.zIndex = ``
          },
        })

        interact(node).gesturable({
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
            // todo parametrize this (rotating frame)
            // angle = event.angle - fingerAngleOffset
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
          },
          onend: () => {
            manipulate({
              width: nodeWidth,
              height: nodeHeight,
              left: nodeLeft,
              top: nodeTop,
              angle: nodeAngle,
            })
            node.style.transform = ``
            node.style.width = ``
            node.style.height = ``
            node.style.zIndex = ``
          },
        })
      }
      frameRef.current = node
    },
    [
      angle,
      width,
      height,
      left,
      top,
      isMovingAllowed,
      isResizingAllowed,
      isFullscreenAllowed,
      isFullscreen,
      bringToFront,
      manipulate,
      toggleFullscreen,
    ]
  )
  return [frameRefReceiver]
}

const Frame: React.FC<FrameProps> = ({ frameId, frame, stackIndex }) => {
  const dispatch = useDispatch()
  const { width, height, left, top, angle, isFullscreen } = frame.situation
  const [isMovingAllowed, setMovingAllowed] = useState(true)
  const [isResizingAllowed, setResizingAllowed] = useState(true)
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

  const [frameRefReceiver] = useInteractJs({
    width,
    height,
    left,
    top,
    angle,
    isFullscreenAllowed,
    isFullscreen,
    isMovingAllowed,
    isResizingAllowed,
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
      preventMoving: () => {
        setMovingAllowed(false)
      },
      preventFullscreen: () => {
        console.debug("Prevent fullscreen")
        setFullscreenAllowed(false)
      },
    }),
    [manipulate, width]
  )

  const ContentBlockComponent = useMemo(
    () => contentBlockRegister[frame.type],
    [frame.type]
  )

  return (
    <StyledFrame
      onClick={bringToFront}
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
        <FrameControlBar onClose={() => dispatch(closeFrame(frameId))} />
        <ContentBlockComponent
          frameId={frameId}
          contentData={frameContentData}
        />
      </FrameContext.Provider>
    </StyledFrame>
  )
}

export default Frame
