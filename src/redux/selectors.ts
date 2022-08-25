import { FrameId, SpectaclePresentation, SpectacleScene } from "../types"

export const getFrames = (store: SpectaclePresentation) =>
  store.scenes.scenes[store.scenes.activeScene].frames

export const getScene = (
  store: SpectaclePresentation,
  sceneId
): SpectacleScene => store.scenes.scenes[sceneId]

export const getFrame = (store: SpectaclePresentation, frameId: FrameId) =>
  getFrames(store)[frameId]
