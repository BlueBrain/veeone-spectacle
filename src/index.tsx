import React from "react"
import { Spectacle } from "./spectacle"
import ReactDOM from "react-dom"
import AppConfigContextProvider from "./config/AppConfigContextProvider"
import SpectacleStoreProvider from "./redux/SpectacleStoreProvider"
import startSentry from "./sentry"
import { getConfig } from "./config"

function start() {
  const config = getConfig()
  const isBrowser = typeof window !== "undefined"

  if (isBrowser) {
    window.oncontextmenu = event => event.preventDefault()
    window.document.title = `Spectacle ${config.VERSION} (${config.REVISION})`
  }

  startSentry()

  ReactDOM.render(
    <AppConfigContextProvider>
      <SpectacleStoreProvider>
        <Spectacle />
      </SpectacleStoreProvider>
    </AppConfigContextProvider>,
    document.getElementById("root")
  )
}

start()
