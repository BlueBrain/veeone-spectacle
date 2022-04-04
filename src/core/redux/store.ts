import { createStore } from "redux"
import { rootReducer } from "../../redux/root"
import { SpectaclePresentation } from "../types"
import { config } from "../../config"
import { generateRandomPresentationId } from "../presentations/utils"

const now = Date.now()

const initialSpectacleState: SpectaclePresentation = {
  id: generateRandomPresentationId(),
  name: "Untitled",
  createdAt: now,
  updatedAt: now,
  savedAt: null,
  meta: {
    viewport: {
      width: config.get("VIEWPORT_WIDTH"),
      height: config.get("VIEWPORT_HEIGHT"),
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
