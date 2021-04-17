import { FrameSituation } from "../common/types"

export interface FrameData {
  situation: FrameSituation
}

export interface FramesData {
  [key: string]: FrameData
}

export interface PresentationStateData {
  frames: FramesData
}

