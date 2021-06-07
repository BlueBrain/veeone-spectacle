import { createStore } from "redux"
import { rootReducer } from "./reducers"
import { PresentationStateData } from "../presentations/interfaces"

const initialSpectacleState: PresentationStateData = {
  frames: {
    // abcdef: {
    //   situation: { left: 100, top: 200, width: 500, height: 400, angle: 0 }
    // },
    // efghij: {
    //   situation: { left: 400, top: 100, width: 200, height: 200, angle: 0 }
    // }
  },
  frameStack: [],
  launcherMenus: [],
}
export const spectacleStore = createStore(
  rootReducer,
  initialSpectacleState,
  typeof window !== "undefined"
    ? // @ts-ignore
      window.__REDUX_DEVTOOLS_EXTENSION__ &&
        window.__REDUX_DEVTOOLS_EXTENSION__()
    : undefined
)
