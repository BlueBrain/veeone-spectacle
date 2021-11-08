import { SceneStateData } from "../core/scenes/interfaces"
import { ReduxAction } from "./actions"
import {
  framesReducer,
  frameStackReducer,
  launcherMenuReducer,
} from "../core/redux/reducers"

export const rootReducer = (state: SceneStateData, action: ReduxAction) => ({
  frames: framesReducer(state.frames, action),
  frameStack: frameStackReducer(state.frameStack, action),
  launcherMenus: launcherMenuReducer(state.launcherMenus, action),
})
