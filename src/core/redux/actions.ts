import { FrameId, FrameSituationUpdate, Position } from "../types"
import { ContentBlockTypes } from "../../ContentBlocks/register"

export enum Actions {
  AddFrame,
  ManipulateFrame,
  CloseFrame,
  BringFrameToFront,
  OpenLauncherMenu,
  CloseLauncherMenu,
}

export interface ReduxAction {
  type: Actions
  payload: any
}

export interface AddFramePayload {
  position: Position
  type: ContentBlockTypes
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

export const bringFrameToFront = (frameId) => ({
  type: Actions.BringFrameToFront,
  payload: { frameId }
})

export const closeFrame = (frameId: FrameId) => ({
  type: Actions.CloseFrame,
  payload: {
    frameId
  }
})

export interface OpenLauncherMenuPayload {
  position: Position
}

export const openLauncherMenu = (payload: OpenLauncherMenuPayload) => ({
  type: Actions.OpenLauncherMenu,
  payload: payload
})

export interface CloseLauncherMenuPayload {
  menuId: string
}

export const closeLauncherMenu = (payload: CloseLauncherMenuPayload) => ({
  type: Actions.CloseLauncherMenu,
  payload: payload
})
