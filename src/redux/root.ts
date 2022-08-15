import { ReduxAction } from "./actions"
import { presentationReducer, scenesReducer } from "../core/redux/reducers"
import { SpectaclePresentation } from "../core/types"
import { Actions } from "../core/redux/actions"
import { ApplicationConfig } from "../config/types"
import { generateRandomPresentationId } from "../core/presentations/utils"

export const rootReducer = (
  state: SpectaclePresentation,
  action: ReduxAction,
  config: ApplicationConfig
): SpectaclePresentation => {
  switch (action.type) {
    case Actions.OpenPresentation: {
      return { ...action.payload }
    }
    case Actions.SavePresentation: {
      return { ...action.payload }
    }
    case Actions.ResizePresentation: {
      return presentationReducer(state, action, config)
    }
    default: {
      const newUpdatedAt = action.mutative ? Date.now() : state.updatedAt
      return {
        ...state,
        scenes: scenesReducer(state, action),
        updatedAt: newUpdatedAt,
      }
    }
  }
}
