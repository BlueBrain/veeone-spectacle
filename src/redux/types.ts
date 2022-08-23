import { Actions } from "./actions"

export interface ReduxAction {
  type: Actions
  payload: any
  mutative: boolean
}
