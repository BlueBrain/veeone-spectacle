import { generateRandomPresentationId } from "./utils"
import { ApplicationConfig } from "../config/types"
import { SpectaclePresentation } from "../types"

interface Args {
  config: ApplicationConfig
}

interface GetFreshPresentationArgs {
  (args: Args): SpectaclePresentation
}

export const getFreshPresentation: GetFreshPresentationArgs = ({ config }) => {
  /**
   * This functions provides a base structure for a freshly created presentation.
   * It's used when starting up the application or selecting "New" option from
   * the launcher menu.
   */
  const now = Date.now()
  const newStore: SpectaclePresentation = {
    id: generateRandomPresentationId(),
    name: "",
    folder: null,
    createdAt: now,
    updatedAt: now,
    savedAt: null,
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
  return newStore
}
