import { ApplicationConfig } from "../config/types"
import { SpectaclePresentation } from "../types"

interface Args {
  config: ApplicationConfig
  defaultStore?: Partial<SpectaclePresentation>
}

interface GetFreshPresentationArgs {
  (args: Args): SpectaclePresentation
}

export const getFreshPresentation: GetFreshPresentationArgs = ({
  config,
  defaultStore = {},
}) => {
  /**
   * This functions provides a base structure for a freshly created presentation.
   * It's used when starting up the application or selecting "New" option from
   * the launcher menu.
   */
  const now = Date.now()
  const newStore: SpectaclePresentation = {
    id: null,
    targetEnvironment: null,
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
    ...defaultStore,
  }
  console.debug("newStore", newStore.targetEnvironment)
  return newStore
}
