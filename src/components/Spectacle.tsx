import * as React from "react"

import * as styles from "./Spectacle.module.scss"
import Desk from "./Desk"
import reactable from "reactablejs"

const ReactableDesk = reactable(Desk)

const Spectacle = () => {
  return (
    <div className={styles.Spectacle}>
      <ReactableDesk onHold={() => {
        console.debug("Holding...")
      }}/>
    </div>
  )
}

export default Spectacle
