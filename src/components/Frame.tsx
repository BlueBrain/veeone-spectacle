import * as React from "react"
import ContentBlock from "./ContentBlock"
import reactable from "reactablejs"

const ReactableContentBlock = reactable(ContentBlock)

interface FrameProps {
  initPosition: { x: number, y: number }
}

const Frame: React.FC<FrameProps> = (props: FrameProps) => {
  const [coordinate, setCoordinate] = React.useState({x: props.initPosition.x, y: props.initPosition.y})
  return (<ReactableContentBlock
    resizable={{
      edges: {left: true, right: true, bottom: true, top: true},

    }}

    onDoubleTap={() => {
      setCoordinate(prev => ({
        x: 0,
        y: 0,
        width: 2000,
        height: 2000,
      }))
    }}

    draggable={{
      inertia: true,
      onmove: event => {
        const {dx, dy} = event
        setCoordinate(prev => ({
          x: prev.x + dx,
          y: prev.y + dy,
        }))
      }
    }}
    onResizeMove={e => {
      const {width, height} = e.rect
      const {left, top} = e.deltaRect
      setCoordinate(prev => {
        return {
          x: prev.x + left,
          y: prev.y + top,
          width,
          height,
        }
      })
    }}
    coordinate={coordinate}
  />)
}

export default Frame
