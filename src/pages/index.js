import * as React from "react"
import Spectacle from "../components/Spectacle";

const isBrowser = typeof window !== "undefined"

const IndexPage = () => {

  if (isBrowser) {
    window.oncontextmenu = event => event.preventDefault()
  }
  return <Spectacle/>
}

export default IndexPage
