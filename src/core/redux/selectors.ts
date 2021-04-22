import { PresentationStateData } from "../presentations/interfaces"
import { FrameId } from "../types"

export const getFrames = (store: PresentationStateData) => store.frames

export const getFrame = (store: PresentationStateData, frameId: FrameId) => {
  const result = getFrames(store)[frameId]
  console.debug("getFrame selector", frameId, result)
  return result
}

export const getLauncherMenus = (store: PresentationStateData) => store.launcherMenus
