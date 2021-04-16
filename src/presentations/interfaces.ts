import { FrameSituation } from "../common/types"

interface FrameData {
  situation: FrameSituation
}

export default interface PresentationData {
  frames: Record<string, FrameData>
}

