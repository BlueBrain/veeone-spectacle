import { ReduxAction } from "./types"
import { presentationReducer, scenesReducer } from "./reducers"
import { SpectaclePresentation } from "../types"
import { Actions } from "./actions"
import { ApplicationConfig } from "../config/types"

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
