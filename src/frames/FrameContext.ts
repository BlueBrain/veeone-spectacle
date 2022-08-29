import React, { useContext } from "react"
import { FrameContextProps } from "./types"

const FrameContext = React.createContext<FrameContextProps>(null)

export default FrameContext

export const useFrame = () => useContext(FrameContext)
