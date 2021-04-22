import { FrameId, PresentationStateData } from "../presentations/interfaces"

export const getFrames = (store: PresentationStateData) => store.frames

export const getFrameStack = (store: PresentationStateData) => store.frameStack

export const getFrame = (store: PresentationStateData, frameId: FrameId) => {
  const result = getFrames(store)[frameId]
  console.debug("getFrame selector", frameId, result)
  return result
}

export const getLauncherMenus = (store: PresentationStateData) => store.launcherMenus
