export type FrameSituation = {
  left: number
  top: number
  width: number
  height: number
  angle: number
  isFullscreen?: boolean
}

export type FrameSituationUpdate = {
  left?: number
  top?: number
  width?: number
  height?: number
  angle?: number
  isFullscreen?: boolean
}

export type FrameId = string
