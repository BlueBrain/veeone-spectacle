import { Position, Size } from "../../common/types"
import { ContentBlockTypes } from "../../contentblocks/types"
import {
  FrameData,
  FrameId,
  FrameSituationUpdate,
  SceneId,
  SpectaclePresentation,
} from "../types"

export enum Actions {
  LoadPresentation,
  AddFrame,
  ManipulateFrame,
  CloseFrame,
  BringFrameToFront,
  SendFrameToBack,
  CloseAllFrames,
  UpdateFrameData,
  AddScene,
  SetActiveScene,
  RemoveScene,
  SwitchToNextScene,
  SwitchToPreviousScene,
  MoveSceneLeft,
  MoveSceneRight,
}

export interface AddFramePayload {
  type: ContentBlockTypes
  frameId: FrameId
  position: Position
  size?: Size
  contentData: FrameData
}

export interface AddScenePayload {
  sceneId: SceneId
}

export interface SetScenePayload {
  sceneId: SceneId
}

export interface RemoveScenePayload {
  sceneId: SceneId
}

export interface MoveScenePayload {
  sceneId: SceneId
}

export const addFrame = (payload: AddFramePayload) => ({
  type: Actions.AddFrame,
  payload,
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

export const addScene = (payload: AddScenePayload) => ({
  type: Actions.AddScene,
  payload,
})

export const switchToNextScene = () => ({
  type: Actions.SwitchToNextScene,
  payload: null,
})

export const switchToPreviousScene = () => ({
  type: Actions.SwitchToPreviousScene,
  payload: null,
})

export const setActiveScene = (sceneId: SceneId) => ({
  type: Actions.SetActiveScene,
  payload: { sceneId },
})

export const loadPresentationStore = (newStore: SpectaclePresentation) => ({
  type: Actions.LoadPresentation,
  payload: newStore,
})

export const moveSceneLeft = (sceneId: SceneId) => ({
  type: Actions.MoveSceneLeft,
  payload: { sceneId },
})

export const moveSceneRight = (sceneId: SceneId) => ({
  type: Actions.MoveSceneRight,
  payload: { sceneId },
})

export const removeScene = (sceneId: SceneId) => ({
  type: Actions.RemoveScene,
  payload: { sceneId },
})
