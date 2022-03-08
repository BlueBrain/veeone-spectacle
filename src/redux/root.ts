import { ReduxAction } from "./actions"
import { scenesReducer } from "../core/redux/reducers"
import { SpectaclePresentation } from "../core/types"
import { Actions } from "../core/redux/actions"

export const rootReducer = (
  state: SpectaclePresentation,
  action: ReduxAction
) => {
  if (action.type === Actions.LoadPresentation) {
    return { ...action.payload }
  }

  return {
    ...state,
    scenes: scenesReducer(state, action),
  }
}
