import * as React from "react"
import "@interactjs/modifiers"
import { FrameEntry, FrameId } from "../types"
import FrameContextProvider from "./FrameContextProvider"
import FrameBody from "./FrameBody"

interface FrameProps {
  frame: FrameEntry
  frameId: FrameId
  stackIndex: number
}

const Frame: React.FC<FrameProps> = ({ frameId, frame, stackIndex }) => {
  return (
    <FrameContextProvider
      frameId={frameId}
      frame={frame}
      stackIndex={stackIndex}
    >
      <FrameBody />
    </FrameContextProvider>
  )
}

export default Frame
