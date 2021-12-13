import { ReduxAction } from "./actions"
import { framesReducer, frameStackReducer } from "../core/redux/reducers"
import { SpectaclePresentation } from "../core/types"

export const rootReducer = (
  state: SpectaclePresentation,
  action: ReduxAction
) => {
  const activeSceneKey = state.scenes.activeSceneKey
  const activeScene = state.scenes.scenes[activeSceneKey]
  return {
    ...state,
    scenes: {
      ...state.scenes,
      scenes: {
        ...state.scenes.scenes,
        [activeSceneKey]: {
          frames: framesReducer(activeScene.frames, action),
          frameStack: frameStackReducer(activeScene.frameStack, action),
        },
      },
    },
  }
}
