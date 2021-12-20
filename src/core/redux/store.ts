import { createStore } from "redux"
import { rootReducer } from "../../redux/root"
import { SpectaclePresentation } from "../types"
import { config } from "../../config"

const now = Date.now()

const initialSpectacleState: SpectaclePresentation = {
  id: crypto.randomUUID(),
  name: "Untitled",
  createdAt: now,
  updatedAt: now,
  meta: {
    viewport: {
      width: config.VIEWPORT_WIDTH,
      height: config.VIEWPORT_HEIGHT,
    },
  },
  scenes: {
    activeScene: "main",
    sceneOrder: ["main"],
    scenes: {
      main: {
        frames: {},
        frameStack: [],
      },
    },
  },
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
