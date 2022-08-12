import { Provider } from "react-redux"
import React, { useMemo } from "react"
import { useConfig } from "../../config/AppConfigContext"
import { createStore } from "redux"
import { rootReducer } from "../../redux/root"
import { SpectaclePresentation } from "../types"
import { ReduxAction } from "../../redux/actions"
import { getFreshPresentation } from "../presentations/fresh-presentation"

const SpectacleStoreProvider: React.FC = ({ children }) => {
  const config = useConfig()

  const initialSpectacleState: SpectaclePresentation = useMemo(
    () => getFreshPresentation({ config }),
    [config]
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
