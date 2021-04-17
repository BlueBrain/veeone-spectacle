import { FrameId, FrameSituationUpdate } from "../common/types"

export enum Actions {
  AddFrame = 'AddFrame',
  ManipulateFrame = 'ManipulateFrame',
  CloseFrame = 'CloseFrame',
}

export interface ReduxAction {
  type: Actions
  payload: any
}

export const addFrame = () => ({
  type: Actions.AddFrame,
  payload: {},
})

export const manipulateFrame = (frameId: FrameId, situationUpdate: FrameSituationUpdate) => ({
  type: Actions.ManipulateFrame,
  payload: {
    frameId,
    situationUpdate,
  }
})

export const closeFrame = (frameId: FrameId) => ({
  type: Actions.CloseFrame,
  payload: {
    frameId
  }
})
