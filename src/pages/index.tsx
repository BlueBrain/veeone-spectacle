import * as React from "react"
import { Spectacle } from "../core/components"
import { spectacleStore } from "../core/redux/store"
import { Provider } from "react-redux"
import "./global.scss"

const isBrowser = typeof window !== "undefined"

const IndexPage = () => {
  if (isBrowser) {
    window.oncontextmenu = event => event.preventDefault()
  }
  return <Provider store={spectacleStore}><Spectacle /></Provider>
}

export default IndexPage
