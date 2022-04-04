import { ReduxAction } from "./actions"
import { presentationReducer, scenesReducer } from "../core/redux/reducers"
import { SpectaclePresentation } from "../core/types"
import { Actions } from "../core/redux/actions"
import { ApplicationConfig } from "../config/types"

export const rootReducer = (
  state: SpectaclePresentation,
  action: ReduxAction,
  config: ApplicationConfig
) => {
  if (action.type === Actions.OpenPresentation) {
    return { ...action.payload }
  }

  if (action.type === Actions.ResizePresentation) {
    return presentationReducer(state, action, config)
  }

  return {
    ...state,
    scenes: scenesReducer(state, action),
  }
}
