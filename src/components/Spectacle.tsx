import * as React from "react"
import { Helmet } from "react-helmet"
import * as styles from "./Spectacle.module.scss"
import Desk from "./Desk"
import reactable from "reactablejs"
import { PresentationStateData } from "../presentations/interfaces"
import { Provider } from "react-redux"
import { createStore } from "redux"
import { presentationReducer } from "../redux/reducers"

const ReactableDesk = reactable(Desk)

const initialSpectacleState: PresentationStateData = {
  frames: {
    abcdef: {
      situation: { left: 100, top: 200, width: 300, height: 100, angle: 0, scale: 1 }
    },
    efghij: {
      situation: { left: 400, top: 100, width: 200, height: 200, angle: 0, scale: 1 }
    },
  },
}


const spectacleStore = createStore(presentationReducer, initialSpectacleState)

const Spectacle = () => {
  return (
    <Provider store={spectacleStore}>
      <div className={styles.Spectacle}>
        <Helmet>
          <meta name="viewport" content="initial-scale=1.0, maximum-scale=1.0, user-scalable=no"/>
        </Helmet>
        <ReactableDesk
          presentationData={initialSpectacleState}
          onHold={() => {
            console.debug("Holding...")
          }}/>
      </div>
    </Provider>
  )
}

export default Spectacle
