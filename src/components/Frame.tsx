import * as React from "react"
import ContentBlock from "./ContentBlock"
import reactable from "reactablejs"
import {FrameSituation} from "../common/types"

const ReactableContentBlock = reactable(ContentBlock)

interface FrameProps {
  initialPosition: FrameSituation
}

const Frame: React.FC<FrameProps> = (props: FrameProps) => {
  const [framePosition, setFramePosition] = React.useState(props.initialPosition)
  return (
    <ReactableContentBlock
      resizable={{
        edges: {left: true, right: true, bottom: true, top: true},
      }}

      onDoubleTap={() => {
        setFramePosition(prev => ({
          left: prev.left,
          top: prev.top,
          width: prev.width,
          height: prev.height,
          isFullscreen: !prev.isFullscreen,
          cssTransitionEnabled: prev.isFullscreen,
        }))
      }}

      draggable={{
        inertia: true,
        onmove: event => {
          const {dx, dy} = event
          setFramePosition(prev => ({
            left: prev.left + dx,
            top: prev.top + dy,
            width: prev.width,
            height: prev.height,
            cssTransitionEnabled: false,
          }))
        }
      }}
      onResizeMove={
        event => {
          const {width, height} = event.rect
          const {left, top} = event.deltaRect
          setFramePosition(prev => {
            return {
              left: prev.left + left,
              top: prev.top + top,
              width,
              height,
              cssTransitionEnabled: false,
            }
          })
        }}
      coordinate={framePosition}
    />)
}

export default Frame
