import * as React from "react"
import { CSSProperties } from "react"
import ContentBlock from "./ContentBlock"
import reactable from "reactablejs"
import { FrameId, FrameSituation, FrameSituationUpdate } from "../common/types"
import '@interactjs/modifiers'
import interact from '@interactjs/interact'
import { connect } from "react-redux"
import { manipulateFrame } from "../redux/actions"
import { FrameData, PresentationStateData } from "../presentations/interfaces"
import { getFrame } from "../redux/selectors"

const ReactableContentBlock = reactable(ContentBlock)

interface StateProps {
  frame: FrameData
}

interface DispatchProps {
  manipulateFrame(frameId: FrameId, situation: FrameSituationUpdate): void
}

interface FrameProps {
  frameId: FrameId,
}

type Props = FrameProps & StateProps & DispatchProps

const Frame: React.FC<Props> = (
  {
    frameId,
    frame,
    manipulateFrame,
  }
) => {
  // console.warn("frame props", frame.situation)
  // const [isFullscreen, setFullscreen] = useState(frame.situation.isFullscreen)
  let { width, height, left, top, angle, isFullscreen } = frame.situation
  let gesturableStart: FrameSituation
  let fingerAngleOffset = 0

  const manipulate = (newSituation: FrameSituationUpdate) => {
    manipulateFrame(frameId, newSituation)
  }

  const toggleFullscreen = () => {
    isFullscreen = !isFullscreen
    const data = { isFullscreen: isFullscreen }
    manipulate(data)
  }

  const setFrameSituationProperties = (style: CSSProperties) => {
    style.transform = `translateX(${left}px) translateY(${top}px) rotate(${angle}deg)`
    style.width = `${width}px`
    style.height = `${height}px`
  }

  return (
    <ReactableContentBlock
      onDoubleTap={() => toggleFullscreen()}
      frameId={frameId}
      resizable={{
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
        onend: () => manipulate({ left, top, width, height })
      }}

      gesturable={{
        preserveAspectRatio: false,
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
        onend: () => manipulate({ width, height, left, top, angle }),
      }}

      draggable={{
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
        onend: () => {
          manipulate({ left, top })
        },
        onmove: event => {
          const { dx, dy } = event
          left += dx
          top += dy
          setFrameSituationProperties(event.target.style)
        }
      }}
    />)
}
const mapStateToProps = (state: PresentationStateData, ownProps: FrameProps) => ({
  frame: getFrame(state, ownProps.frameId),
})
export default connect(mapStateToProps, { manipulateFrame })(Frame)
