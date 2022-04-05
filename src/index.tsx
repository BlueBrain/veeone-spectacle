import React from "react"
import { Spectacle } from "./core/spectacle"
import ReactDOM from "react-dom"
import AppConfigContextProvider from "./config/AppConfigContextProvider"
import SpectacleStoreProvider from "./core/redux/SpectacleStoreProvider"

function start() {
  const isBrowser = typeof window !== "undefined"
  if (isBrowser) {
    window.oncontextmenu = event => event.preventDefault()
  }
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
