import { Actions } from "../core/redux/actions"

export interface ReduxAction {
  type: Actions
  payload: any
  mutative: boolean
}
