import { FrameId, PresentationStateData } from "../presentations/interfaces"

export const getFrames = (store: PresentationStateData) => store.frames

export const getFrameStack = (store: PresentationStateData) => store.frameStack

export const getFrame = (store: PresentationStateData, frameId: FrameId) =>
  getFrames(store)[frameId]

export const getLauncherMenus = (store: PresentationStateData) =>
  store.launcherMenus
