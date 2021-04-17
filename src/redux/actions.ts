import { FrameId, FrameSituation } from "../common/types"

export enum Actions {
  AddFrame = 'AddFrame',
  CloseFrame = 'CloseFrame',
  SetFrameSituation = 'SetFrameSituation',
}

export interface ReduxAction {
  type: Actions
  payload: any
}

export const addFrame = () => ({
  type: Actions.AddFrame,
  payload: {},
})

export const setFrameSituation = (frameId: FrameId, situation: FrameSituation) => ({
  type: Actions.SetFrameSituation,
  payload: {
    frameId,
    situation,
  }
})

export const closeFrame = (frameId: FrameId) => ({
  type: Actions.CloseFrame,
  payload: {
    frameId
  }
})
