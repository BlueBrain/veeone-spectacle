export type FrameSituation = {
  left: number
  top: number
  width: number
  height: number
  angle: number
  scale: number
  isFullscreen?: boolean
  isTransforming?: boolean
  cssTransitionEnabled?: boolean
}

export type FrameId = string
