import * as React from "react"
import { Helmet } from "react-helmet"
import * as styles from "./Spectacle.module.scss"
import Desk from "./Desk"
import reactable from "reactablejs"
import PresentationData from "../presentations/interfaces"

const ReactableDesk = reactable(Desk)

const INITIAL_FRAMES: PresentationData = {
  frames: {
    abcd: {
      situation: { left: 100, top: 200, width: 300, height: 100, angle: 0, scale: 1 }
    },
    efgh: {
      situation: { left: 400, top: 100, width: 200, height: 200, angle: 0, scale: 1 }
    },
  },
}

const Spectacle = () => {
  return (
    <div className={styles.Spectacle}>
      <Helmet>
        <meta name="viewport" content="initial-scale=1.0, maximum-scale=1.0, user-scalable=no"/>
      </Helmet>
      <ReactableDesk
        presentationData={INITIAL_FRAMES}
        onHold={() => {
          console.debug("Holding...")
        }}/>
    </div>
  )
}

export default Spectacle
