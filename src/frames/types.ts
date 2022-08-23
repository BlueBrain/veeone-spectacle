import { FrameId } from "../types"

export interface FrameContextProps {
  frameId: FrameId
  isTopFrame: boolean
  stackIndex: number
  updateAspectRatio(aspectRatio: number): void
  toggleFullscreen(): void
  preventMoving(): void
  preventResizing(): void
  preventResizingWithWheel(): void
  preventFullscreen(): void
  close(): void
  sendToBack(): void
  setFullscreenParamsProvider(handler: Function): void
}
