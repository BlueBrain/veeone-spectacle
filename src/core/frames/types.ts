export interface FrameContextProps {
  updateAspectRatio: (aspectRatio: number) => void
  toggleFullscreen: () => void
  preventMoving: () => void
  preventResizing: () => void
  preventResizingWithWheel: () => void
  preventFullscreen: () => void
  close: () => void
  sendToBack: () => void
}
