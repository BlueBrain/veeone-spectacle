import * as React from "react"
import Spectacle from "../components/Spectacle"
import { spectacleStore } from "../redux/store"
import { Provider } from "react-redux"

const isBrowser = typeof window !== "undefined"

const IndexPage = () => {
  if (isBrowser) {
    window.oncontextmenu = event => event.preventDefault()
  }
  return <Provider store={spectacleStore}><Spectacle/></Provider>
}

export default IndexPage
