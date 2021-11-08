import { FrameId, SceneStateData } from "../scenes/interfaces"

export const getFrames = (store: SceneStateData) => store.frames

export const getFrameStack = (store: SceneStateData) => store.frameStack

export const getFrame = (store: SceneStateData, frameId: FrameId) =>
  getFrames(store)[frameId]

export const getLauncherMenus = (store: SceneStateData) => store.launcherMenus
