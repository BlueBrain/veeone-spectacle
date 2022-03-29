import { ReduxAction } from "./actions"
import { presentationReducer, scenesReducer } from "../core/redux/reducers"
import { SpectaclePresentation } from "../core/types"
import { Actions } from "../core/redux/actions"

export const rootReducer = (
  state: SpectaclePresentation,
  action: ReduxAction
) => {
  if (action.type === Actions.OpenPresentation) {
    return { ...action.payload }
  }

  if (action.type === Actions.ResizePresentation) {
    return presentationReducer(state, action)
  }

  return {
    ...state,
    scenes: scenesReducer(state, action),
  }
}
