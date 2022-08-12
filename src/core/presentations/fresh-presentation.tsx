import { generateRandomPresentationId } from "./utils"
import { ApplicationConfig } from "../../config/types"
import { SpectaclePresentation } from "../types"

interface Args {
  config: ApplicationConfig
}

interface GetFreshPresentationArgs {
  (args: Args): SpectaclePresentation
}

export const getFreshPresentation: GetFreshPresentationArgs = ({ config }) => {
  const now = Date.now()
  const newStore: SpectaclePresentation = {
    id: generateRandomPresentationId(),
    name: "Untitled",
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
