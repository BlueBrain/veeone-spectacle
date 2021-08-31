import { Position, Size } from "../types"
import { ContentBlockTypes } from "../../contentblocks/types"
import {
  FrameData,
  FrameId,
  FrameSituationUpdate,
  PresentationDataPayload,
  PresentationStateData,
} from "../presentations/interfaces"

export enum Actions {
  LoadPresentation,
  AddFrame,
  ManipulateFrame,
  CloseFrame,
  BringFrameToFront,
  OpenLauncherMenu,
  CloseLauncherMenu,
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

export const closeFrame = (frameId: FrameId) => ({
  type: Actions.CloseFrame,
  payload: {
    frameId,
  },
})

export const closeAllFrames = () => ({
  type: Actions.CloseAllFrames,
  payload: {},
})

export interface OpenLauncherMenuPayload {
  position: Position
}

export const openLauncherMenu = (payload: OpenLauncherMenuPayload) => ({
  type: Actions.OpenLauncherMenu,
  payload: payload,
})

export interface CloseLauncherMenuPayload {
  menuId: string
}

export const closeLauncherMenu = (payload: CloseLauncherMenuPayload) => ({
  type: Actions.CloseLauncherMenu,
  payload: payload,
})

export const loadPresentation = (payload: PresentationDataPayload) => ({
  type: Actions.LoadPresentation,
  payload: payload,
})
