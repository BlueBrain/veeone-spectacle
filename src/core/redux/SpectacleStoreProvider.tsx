import { Provider } from "react-redux"
import React, { useMemo } from "react"
import { useConfig } from "../../config/AppConfigContext"
import { createStore } from "redux"
import { rootReducer } from "../../redux/root"
import { SpectaclePresentation } from "../types"
import { generateRandomPresentationId } from "../presentations/utils"
import { ReduxAction } from "../../redux/actions"

const SpectacleStoreProvider: React.FC = ({ children }) => {
  const config = useConfig()

  const now = useMemo(() => Date.now(), [])

  const initialSpectacleState: SpectaclePresentation = useMemo(
    () => ({
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
    }),
    [config.VIEWPORT_HEIGHT, config.VIEWPORT_WIDTH, now]
  )

  const spectacleStore = useMemo(() => {
    return createStore(
      (state: SpectaclePresentation, action: ReduxAction) =>
        rootReducer(state, action, config),
      initialSpectacleState,
      typeof window !== "undefined"
        ? // @ts-ignore
          window.__REDUX_DEVTOOLS_EXTENSION__ &&
            // @ts-ignore
            window.__REDUX_DEVTOOLS_EXTENSION__()
        : undefined
    )
  }, [config, initialSpectacleState])

  return <Provider store={spectacleStore}>{children}</Provider>
}

export default SpectacleStoreProvider
