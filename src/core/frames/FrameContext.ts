import { NotImplementedError } from "../../common/errors"
import React from "react"
import { FrameContextProps } from "./types"

const FrameContext = React.createContext<FrameContextProps>({
  updateAspectRatio: () => {
    throw new NotImplementedError()
  },
  preventResizing: () => {
    throw new NotImplementedError()
  },
  preventMoving: () => {
    throw new NotImplementedError()
  },
  preventFullscreen: () => {
    throw new NotImplementedError()
  },
  toggleFullscreen: () => {
    throw new NotImplementedError()
  },
})

export default FrameContext
