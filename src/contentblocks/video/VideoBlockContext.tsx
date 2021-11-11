import { createContext } from "react"
import { NotImplementedError } from "../../common/errors"

export interface VideoBlockContextProps {
  setActiveModeToggleHandler: (handlerFunction: Function) => void
}

const VideoBlockContext = createContext<VideoBlockContextProps>({
  setActiveModeToggleHandler: () => {
    throw new NotImplementedError()
  },
})

export default VideoBlockContext
