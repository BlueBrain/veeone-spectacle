import { NotImplementedError } from "../../common/errors"
import React from "react"
import { FrameContextProps } from "./types"

const FrameContext = React.createContext<FrameContextProps>({
  updateAspectRatio: () => {
    throw new NotImplementedError()
  },
})

export default FrameContext
