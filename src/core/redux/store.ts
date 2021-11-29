import { createStore } from "redux"
import { SceneStateData } from "../scenes/interfaces"
import { rootReducer } from "../../redux/root"

const initialSpectacleState: SceneStateData = {
  frames: {},
  frameStack: [],
}
export const spectacleStore = createStore(
  rootReducer,
  initialSpectacleState,
  typeof window !== "undefined"
    ? // @ts-ignore
      window.__REDUX_DEVTOOLS_EXTENSION__ &&
        // @ts-ignore
        window.__REDUX_DEVTOOLS_EXTENSION__()
    : undefined
)
