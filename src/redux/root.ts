import { PresentationStateData } from "../core/presentations/interfaces"
import { ReduxAction } from "./actions"
import {
  framesReducer,
  frameStackReducer,
  launcherMenuReducer,
} from "../core/redux/reducers"

export const rootReducer = (
  state: PresentationStateData,
  action: ReduxAction
) => ({
  frames: framesReducer(state.frames, action),
  frameStack: frameStackReducer(state.frameStack, action),
  launcherMenus: launcherMenuReducer(state.launcherMenus, action),
})
