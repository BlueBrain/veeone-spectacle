import { FrameId, SpectaclePresentation } from "../types"

export const getFrames = (store: SpectaclePresentation) =>
  store.scenes.scenes[store.scenes.activeSceneKey].frames

export const getFrameStack = (store: SpectaclePresentation) =>
  store.scenes.scenes[store.scenes.activeSceneKey].frameStack

export const getFrame = (store: SpectaclePresentation, frameId: FrameId) =>
  getFrames(store)[frameId]
