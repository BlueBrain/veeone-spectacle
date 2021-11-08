import * as React from "react"
import { useEffect, useRef } from "react"
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
import { GestureEvent, Target } from "@interactjs/types/index"
import { contentBlockRegister } from "../../contentblocks/content-block-register"

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

const Frame: React.FC<FrameProps> = ({ frameId, frame, stackIndex }) => {
  const dispatch = useDispatch()
  const frameContentData = frame.data
  const frameRef = useRef<any>()
  let { width, height, left, top, angle, isFullscreen } = frame.situation
  let gesturableStart: FrameSituation
  let fingerAngleOffset = 0

  const getTarget = () => (frameRef.current as unknown) as Target

  const manipulate = (newSituation: FrameSituationUpdate) => {
    dispatch(manipulateFrame(frameId, newSituation))
  }

  const bringToFront = () => dispatch(bringFrameToFront(frameId))

  const toggleFullscreen = () => {
    isFullscreen = !isFullscreen
    const data = { isFullscreen: isFullscreen }
    console.debug("toggleFullscreen", data)
    manipulate(data)
  }

  const setFrameSituationProperties = () => {
    frameRef.current.style.transform = `translateX(${left}px) translateY(${top}px) rotate(${angle}deg)`
    frameRef.current.style.width = `${width}px`
    frameRef.current.style.height = `${height}px`
  }

  const resetFrameSituationProperties = () => {
    frameRef.current.style.transform = ``
    frameRef.current.style.width = ``
    frameRef.current.style.height = ``
    frameRef.current.style.zIndex = ``
  }

  // Toggle full screen on double tap
  useEffect(() => {
    interact(getTarget()).on("doubletap", event => {
      const disabledFullscreenFrameTypes = ["filebrowser"]
      if (!disabledFullscreenFrameTypes.includes(frame.type)) {
        toggleFullscreen()
      }
    })
  }, [frameRef, toggleFullscreen])

  // Allow dragging
  useEffect(() => {
    // console.debug("Frame bind draggable", frameRef)
    interact(getTarget()).draggable({
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
        frameRef.current.style.zIndex = "9999"
        console.debug("frame start", left, top, frame.situation)
      },
      onend: () => {
        manipulate({ left, top })
        bringToFront()
        resetFrameSituationProperties()
      },
      onmove: event => {
        const { dx, dy } = event
        left += dx
        top += dy
        setFrameSituationProperties()
      },
    })
  }, [frameRef, manipulate])

  // Allow resizing at the corners and borders
  useEffect(() => {
    interact(getTarget()).resizable({
      edges: {
        left: true,
        right: true,
        bottom: true,
        top: true,
      },
      invert: "reposition",
      onmove: event => {
        const { width: rectWidth, height: rectHeight } = event.rect
        const { left: deltaLeft, top: deltaTop } = event.deltaRect
        left += deltaLeft
        top += deltaTop
        width = rectWidth
        height = rectHeight
        setFrameSituationProperties()
      },
      onend: () => {
        manipulate({ left, top, width, height })
        resetFrameSituationProperties()
      },
    })
  }, [frameRef, manipulate])

  // Allow scaling and rotating (touchscreen only)
  useEffect(() => {
    interact(getTarget()).gesturable({
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
        left += (width - newWidth) / 2
        top += (height - newHeight) / 2
        width = newWidth
        height = newHeight
        setFrameSituationProperties()
      },
      onend: event => {
        manipulate({ width, height, left, top, angle })
        resetFrameSituationProperties()
      },
    })
  }, [frameRef, manipulate])

  // Cleanup
  useEffect(() => {
    const frameElement = frameRef.current
    return () => interact(getTarget() ?? frameElement).unset()
  }, [frameRef, manipulate])

  // Allow scaling frame on mouse wheel
  const handleWheelScaling = event => {
    if (isFullscreen) {
      return
    }
    let diff = -event.deltaY * 0.5
    const scale = diff / width
    width += diff
    height += scale * height
    left -= diff / 2
    top -= diff / 2
    setFrameSituationProperties()
    manipulate({ width, height, left, top })
  }

  const ContentBlockComponent = contentBlockRegister[frame.type]

  return (
    <StyledFrame
      onClick={bringToFront}
      onWheel={handleWheelScaling}
      ref={frameRef}
      isFullscreen={isFullscreen}
      width={width}
      height={height}
      left={left}
      top={top}
      stackIndex={stackIndex}
      angle={angle}
    >
      <FrameControlBar onClose={() => dispatch(closeFrame(frameId))} />
      <ContentBlockComponent frameId={frameId} contentData={frameContentData} />
    </StyledFrame>
  )
}

export default Frame
