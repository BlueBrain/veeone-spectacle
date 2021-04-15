import * as React from "react"
import {Helmet} from "react-helmet"
import * as styles from "./Spectacle.module.scss"
import Desk from "./Desk"
import reactable from "reactablejs"

const ReactableDesk = reactable(Desk)

const Spectacle = () => {
  return (
    <div className={styles.Spectacle}>
      <Helmet>
        <meta name="viewport" content="initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      </Helmet>
      <ReactableDesk onHold={() => {
        console.debug("Holding...")
      }}/>
    </div>
  )
}

export default Spectacle
