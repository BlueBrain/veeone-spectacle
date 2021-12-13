import { Position, Size } from "../../common/types"
import { ContentBlockTypes } from "../../contentblocks/types"
import {
  FrameData,
  FrameId,
  FrameSituationUpdate,
  SceneDataPayload,
} from "../scenes/interfaces"

export enum Actions {
  LoadScene,
  AddFrame,
  ManipulateFrame,
  CloseFrame,
  BringFrameToFront,
  SendFrameToBack,
  CloseAllFrames,
  UpdateFrameData,
}

export interface AddFramePayload {
  type: ContentBlockTypes
  frameId: FrameId
  position: Position
  size?: Size
  contentData: FrameData
}

export const addFrame = (payload: AddFramePayload) => ({
  type: Actions.AddFrame,
  payload: payload,
})

export const manipulateFrame = (
  frameId: FrameId,
  situationUpdate: FrameSituationUpdate
) => ({
  type: Actions.ManipulateFrame,
  payload: {
    frameId,
    situationUpdate,
  },
})

export interface UpdateFrameDataPayload {
  frameId: FrameId
  data: FrameData
}

export const updateFrameData = (frameId: FrameId, data: FrameData) => ({
  type: Actions.UpdateFrameData,
  payload: { frameId, data } as UpdateFrameDataPayload,
})

export const bringFrameToFront = frameId => ({
  type: Actions.BringFrameToFront,
  payload: { frameId },
})

export const sendFrameToBack = frameId => ({
  type: Actions.SendFrameToBack,
  payload: { frameId },
})

export const closeFrame = (frameId: FrameId) => ({
  type: Actions.CloseFrame,
  payload: {
    frameId,
  },
})
