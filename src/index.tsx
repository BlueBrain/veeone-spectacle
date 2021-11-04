import React from "react"
import { Provider } from "react-redux"
import { spectacleStore } from "./core/redux/store"
import { Spectacle } from "./core/components"
import "./global.scss"
import ReactDOM from "react-dom"

function start() {
  const isBrowser = typeof window !== "undefined"
  if (isBrowser) {
    window.oncontextmenu = event => event.preventDefault()
  }
  ReactDOM.render(
    <Provider store={spectacleStore}>
      <Spectacle />
    </Provider>,
    document.getElementById("root")
  )
}

start()
