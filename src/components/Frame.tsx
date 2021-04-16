import * as React from "react"
import { useState } from "react"
import ContentBlock from "./ContentBlock"
import reactable from "reactablejs"
import { FrameSituation } from "../common/types"
import '@interactjs/modifiers'
import interact from '@interactjs/interact'

const ReactableContentBlock = reactable(ContentBlock)

interface FrameProps {
  initialSituation: FrameSituation
}

const Frame: React.FC<FrameProps> = (props: FrameProps) => {
  const [frameSituation, setFrameSituation] = useState(props.initialSituation)

  let initialScale = 1
  let fingerAngleOffset = 0

  return (
    <ReactableContentBlock
      resizable={{
        edges: { left: true, right: true, bottom: true, top: true },
      }}

      gesturable={{
        onstart(event) {
          setFrameSituation(prev => {

            initialScale = prev.scale
            fingerAngleOffset = event.angle - prev.angle
            return {
              ...prev,
              isTransforming: true,
              angle: prev.angle
            }
          })
        },
        onend(event) {
          setFrameSituation(prev => ({...prev, isTransforming: false}))
        },
        preserveAspectRatio: false,
        onmove(event) {
          setFrameSituation(prev => {
            const newAngle = event.angle - fingerAngleOffset
            return {
              ...prev,
              angle: newAngle,
              scale: event.scale * initialScale,
            }
          })
        }
      }}

      draggable={{
        inertia: true,
        modifiers: [
          interact.modifiers.restrictRect({
            restriction: 'parent',
            endOnly: true
          })
        ],
        onstart: event => setFrameSituation(prev => ({...prev, isTransforming: true})),
        onend: event => setFrameSituation(prev => ({...prev, isTransforming: false})),
        onmove: event => {
          const { dx, dy } = event
          setFrameSituation(prev => ({
            ...prev,
            left: prev.left + dx,
            top: prev.top + dy,
            cssTransitionEnabled: false,
          }))
        }
      }}

      onDoubleTap={() => {
        setFrameSituation(prev => ({
          ...prev,
          isFullscreen: !prev.isFullscreen,
          cssTransitionEnabled: prev.isFullscreen,
        }))
      }}

      onResizeMove={
        event => {
          const { width, height } = event.rect
          const { left, top } = event.deltaRect
          console.debug("Resizing", event.rect, event.deltaRect)
          setFrameSituation(prev => {
            return {
              ...prev,
              left: prev.left + left,
              top: prev.top + top,
              width: (width / prev.scale),
              height: (height / prev.scale),
              cssTransitionEnabled: false,
            }
          })
        }}
      frameSituation={frameSituation}
    />)
}

export default Frame
