import { ReduxAction } from "./actions"
import { framesReducer, frameStackReducer } from "../core/redux/reducers"
import { SpectaclePresentation } from "../core/types"
import { Actions } from "../core/redux/actions"

export const rootReducer = (
  state: SpectaclePresentation,
  action: ReduxAction
) => {
  const activeSceneKey = state.scenes.activeScene
  const activeScene = state.scenes.scenes[activeSceneKey]

  if (action.type === Actions.LoadPresentation) {
    return { ...action.payload }
  }

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
