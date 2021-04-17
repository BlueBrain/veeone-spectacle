import * as React from "react"
import { useState } from "react"
import ContentBlock from "./ContentBlock"
import reactable from "reactablejs"
import { FrameId, FrameSituation } from "../common/types"
import '@interactjs/modifiers'
import interact from '@interactjs/interact'
import { connect } from "react-redux"
import { setFrameSituation } from "../redux/actions"

const ReactableContentBlock = reactable(ContentBlock)

interface DispatchProps {
  setFrameSituation
}

interface FrameProps {
  // initialSituation: FrameSituation
  frameId: FrameId
}

type Props = FrameProps & DispatchProps

const Frame: React.FC<Props> = (props: Props) => {
  const [frameSituation, setFrameSituationState] = useState(props.initialSituation)

  let gesturableStart: FrameSituation
  let fingerAngleOffset = 0

  return (
    <ReactableContentBlock
      resizable={{
        edges: {
          left: true,
          right: true,
          bottom: true,
          top: true,
        },
        invert: "reposition",
        // todo aspect ratio limit for scaling
        // modifiers: [
        //   interact.modifiers.aspectRatio({
        //     ratio: 2,
        //     modifiers: [
        //       interact.modifiers.restrictSize({ max: 'parent' })
        //     ]
        //   })
        // ]
      }}

      gesturable={{
        onstart(event) {
          setFrameSituationState(prev => {
            gesturableStart = { ...prev }
            fingerAngleOffset = event.angle - prev.angle
            return {
              ...prev,
              isTransforming: true,
              angle: prev.angle
            }
          })
        },
        onend(event) {
          setFrameSituationState(prev => ({ ...prev, isTransforming: false }))
        },
        preserveAspectRatio: false,
        onmove(event) {
          setFrameSituationState(prev => {
            const newAngle = event.angle - fingerAngleOffset
            const newWidth = gesturableStart.width * event.scale
            const newHeight = gesturableStart.height * event.scale
            return {
              ...prev,
              angle: newAngle,
              // scale: scale,
              left: prev.left + (prev.width - newWidth) / 2,
              top: prev.top + (prev.height - newHeight) / 2,
              width: newWidth,
              height: newHeight,
            }
          })
        }
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
        onstart: event => setFrameSituationState(prev => ({ ...prev, isTransforming: true })),
        onend: event => {
          setFrameSituationState(prev => ({ ...prev, isTransforming: false }))
          props.setFrameSituation(
            props.frameId,
          )
        },
        onmove: event => {
          const { dx, dy } = event
          setFrameSituationState(prev => ({
            ...prev,
            left: prev.left + dx,
            top: prev.top + dy,
            cssTransitionEnabled: false,
          }))
        }
      }}

      onDoubleTap={() => {
        setFrameSituationState(prev => ({
          ...prev,
          isFullscreen: !prev.isFullscreen,
          cssTransitionEnabled: prev.isFullscreen,
        }))
      }}

      onResizeMove={
        event => {
          const { width, height } = event.rect
          const { left, top } = event.deltaRect
          // console.debug("Resizing", event.rect, event.deltaRect)
          setFrameSituationState(prev => {
            return {
              ...prev,
              cssTransitionEnabled: false,
              left: prev.left + left,
              top: prev.top + top,
              width,
              height,
            }
          })
        }}
      frameSituation={frameSituation}
      frameId={props.frameId}
    />)
}

export default connect(null, { setFrameSituation })(Frame)
