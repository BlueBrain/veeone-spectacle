import { FrameId } from "../types"

export interface FrameContextProps {
  frameId: FrameId
  updateAspectRatio: (aspectRatio: number) => void
  toggleFullscreen: () => void
  preventMoving: () => void
  preventResizing: () => void
  preventResizingWithWheel: () => void
  preventFullscreen: () => void
  close: () => void
  sendToBack: () => void
}
