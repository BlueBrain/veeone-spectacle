import { createStore } from "redux"
import { rootReducer } from "./reducers"
import { PresentationStateData } from "../presentations/interfaces"

const initialSpectacleState: PresentationStateData = {
  frames: {
    // abcdef: {
    //   situation: { left: 100, top: 200, width: 500, height: 400, angle: 0, scale: 1, isFullscreen: false }
    // },
    // efghij: {
    //   situation: { left: 400, top: 100, width: 200, height: 200, angle: 0, scale: 1 }
    // },
  },
  launcherMenus: []
}
export const spectacleStore = createStore(rootReducer, initialSpectacleState)
