import * as React from "react"
import { CSSProperties, useEffect, useRef } from "react"
import ContentBlock from "./ContentBlock"
import { FrameId, FrameSituation, FrameSituationUpdate } from "../common/types"
import '@interactjs/modifiers'
import interact from 'interactjs'
import { connect } from "react-redux"
import { closeFrame, manipulateFrame } from "../redux/actions"
import { FrameData, PresentationStateData } from "../presentations/interfaces"
import { getFrame } from "../redux/selectors"
import styled from "styled-components"
import FrameControlBar from "./FrameControlBar"
import { Target } from "@interactjs/types/index"

interface StateProps {
  frame: FrameData
}

interface DispatchProps {
  manipulateFrame(frameId: FrameId, situation: FrameSituationUpdate): void

  closeFrame(frameId: FrameId): void
}

interface FrameProps {
  frameId: FrameId,
}

type Props = FrameProps & StateProps & DispatchProps

const StyledFrame = styled.div(({ isFullscreen, width, height, left, top, angle }) => `
  position: absolute;
  width: ${isFullscreen ? `100%` : `${width}px`};
  height: ${isFullscreen ? `100%` : `${height}px`};
  transform: ${isFullscreen ? `` : `translateX(${left}px) translateY(${top}px) rotate(${angle}deg)`}
`)

const Frame: React.FC<Props> = (
  {
    frameId,
    frame,
    manipulateFrame,
    closeFrame,
  }
) => {
  console.warn("frame props", frame.situation)
  let { width, height, left, top, angle, isFullscreen } = frame.situation
  let gesturableStart: FrameSituation
  let fingerAngleOffset = 0
  const frameRef = useRef()

  const getTarget = () => frameRef.current as unknown as Target

  const manipulate = (newSituation: FrameSituationUpdate) => {
    manipulateFrame(frameId, newSituation)
  }

  const toggleFullscreen = () => {
    isFullscreen = !isFullscreen
    const data = { isFullscreen: isFullscreen }
    console.debug("toggleFullscreen", data)
    manipulate(data)
  }

  const setFrameSituationProperties = (style: CSSProperties) => {
    style.transform = `translateX(${left}px) translateY(${top}px) rotate(${angle}deg)`
    style.width = `${width}px`
    style.height = `${height}px`
  }

  const resetFrameSituationProperties = (style: CSSProperties) => {
    style.transform = ``
    style.width = ``
    style.height = ``
  }

  // Toggle full screen on double tap
  useEffect(() => {
    console.debug("Frame useLayoutEffect", frameRef)
    interact(getTarget()).on('doubletap', toggleFullscreen)
  }, [frameRef, toggleFullscreen])

  // Allow dragging
  useEffect(() => {
    console.debug("Frame bind draggable", frameRef)
    interact(getTarget()).draggable({
      inertia: {
        resistance: 8,
      },
      modifiers: [
        interact.modifiers.restrictRect({
          restriction: 'parent',
          endOnly: true
        }),
      ],
      onstart: () => console.debug("frame start", left, top, frame.situation),
      onend: (event) => {
        manipulate({ left, top })
        resetFrameSituationProperties(event.target.style)
      },
      onmove: event => {
        const { dx, dy } = event
        left += dx
        top += dy
        setFrameSituationProperties(event.target.style)
      }
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
        setFrameSituationProperties(event.target.style)
      },
      onend: (event) => {
        manipulate({ left, top, width, height })
        resetFrameSituationProperties(event.target.style)
      }
    })
  }, [frameRef, manipulate])

  // Allow scaling and rotating (touchscreen only)
  useEffect(() => {
    interact(getTarget()).gesturable({
      onstart: event => {
        fingerAngleOffset = event.angle - angle
        gesturableStart = { left, top, width, height, angle }
      },
      onmove: event => {
        angle = event.angle - fingerAngleOffset
        const newWidth = gesturableStart.width * event.scale
        const newHeight = gesturableStart.height * event.scale
        left += (width - newWidth) / 2
        top += (height - newHeight) / 2
        width = newWidth
        height = newHeight
        setFrameSituationProperties(event.target.style)
      },
      onend: (event) => {
        manipulate({ width, height, left, top, angle })
        resetFrameSituationProperties(event.target.style)
      },
    })
  }, [frameRef, manipulate])

  // Cleanup
  useEffect(() => {
    const frameElement = frameRef.current
    return () => interact(getTarget() ?? frameElement).unset()
  }, [frameRef, manipulate])

  return (
    <StyledFrame
      ref={frameRef}
      isFullscreen={isFullscreen}
      width={width} height={height}
      left={left} top={top}
      angle={angle}>
      <FrameControlBar onClose={() => closeFrame(frameId)}/>
      <ContentBlock frameId={frameId}/>
    </StyledFrame>
  )
}
const mapStateToProps = (state: PresentationStateData, ownProps: FrameProps) => ({
  frame: getFrame(state, ownProps.frameId),
})
export default connect(mapStateToProps, { manipulateFrame, closeFrame })(Frame)
