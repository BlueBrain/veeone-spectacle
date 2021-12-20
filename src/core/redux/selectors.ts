import { FrameId, SpectaclePresentation } from "../types"

export const getFrames = (store: SpectaclePresentation) =>
  store.scenes.scenes[store.scenes.activeScene].frames

export const getFrameStack = (store: SpectaclePresentation) =>
  store.scenes.scenes[store.scenes.activeScene].frameStack

export const getFrame = (store: SpectaclePresentation, frameId: FrameId) =>
  getFrames(store)[frameId]
