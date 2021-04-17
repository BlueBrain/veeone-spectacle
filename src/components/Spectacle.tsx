import * as React from "react"
import { Helmet } from "react-helmet"
import * as styles from "./Spectacle.module.scss"
import Desk from "./Desk"
import reactable from "reactablejs"
import { Provider } from "react-redux"
import { spectacleStore } from "../redux/store"

const ReactableDesk = reactable(Desk)

const Spectacle = () => {
  return (
    <Provider store={spectacleStore}>
      <div className={styles.Spectacle}>
        <Helmet>
          <meta name="viewport" content="initial-scale=1.0, maximum-scale=1.0, user-scalable=no"/>
        </Helmet>
        <ReactableDesk
          // presentationData={initialSpectacleState}
          onHold={() => {
            console.debug("Holding...")
          }}/>
      </div>
    </Provider>
  )
}

export default Spectacle
