import { FrameId, FrameSituationUpdate, Position } from "../common/types"

export enum Actions {
  AddFrame,
  ManipulateFrame,
  CloseFrame,
  OpenLauncherMenu,
  CloseLauncherMenu,
}

export interface ReduxAction {
  type: Actions
  payload: any
}

export interface AddFramePayload {
  position: Position
}

export const addFrame = (payload: AddFramePayload) => ({
  type: Actions.AddFrame,
  payload: payload,
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

interface OpenLauncherMenuPayload {
  position: Position
}

export const openLauncherMenu = (payload: OpenLauncherMenuPayload) => ({
  type: Actions.OpenLauncherMenu,
  payload: payload
})

interface CloseLauncherMenuPayload {
  menuId: string
}

export const closeLauncherMenu = (payload: CloseLauncherMenuPayload) => ({
  type: Actions.CloseLauncherMenu,
  payload: payload
})
