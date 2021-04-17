import { FrameSituation } from "../common/types"

export interface FrameData {
  situation: FrameSituation
}

export interface PresentationStateData {
  frames: Record<string, FrameData>
}

