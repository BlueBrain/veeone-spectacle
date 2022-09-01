import { ContentBlockTypes } from "../contentblocks/types"
import { FrameData, FrameId, FrameSituationUpdate } from "../types"
import { Position, Size } from "../common/types"

export interface AddFramePayload {
  type: ContentBlockTypes
  frameId: FrameId
  position: Position
  size: Size
  contentData: FrameData
}

export interface CloseFramePayload {
  frameId: FrameId
}

export interface ManipulateFramePayload {
  frameId: FrameId
  situationUpdate: FrameSituationUpdate
}

export interface BringFrameToFrontPayload {
  frameId: FrameId
}

export interface SendFrameToBackPayload {
  frameId: FrameId
}

export interface ResizePresentationPayload {
  newSize: Size
}

export interface UpdateFrameDataPayload {
  frameId: FrameId
  data: FrameData
}
