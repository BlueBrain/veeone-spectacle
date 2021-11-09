export interface FrameContextProps {
  updateAspectRatio: (aspectRatio: number) => void
  preventMoving: () => void
  preventResizing: () => void
  preventFullscreen: () => void
}
