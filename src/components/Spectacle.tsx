import * as React from "react"
import { Helmet } from "react-helmet"
import * as styles from "./Spectacle.module.scss"
import Desk from "./Desk"
import reactable from "reactablejs"
import { connect } from "react-redux"
import { openLauncherMenu } from "../redux/actions"

const ReactableDesk = reactable(Desk)

interface SpectacleProps {}

interface DispatchProps {
  openLauncherMenu
}

type Props = SpectacleProps & DispatchProps

const Spectacle = (props: Props) => {
  return (
    <div className={styles.Spectacle}>
      <Helmet>
        <meta name="viewport" content="initial-scale=1.0, maximum-scale=1.0, user-scalable=no"/>
      </Helmet>
      <ReactableDesk
        onHold={(event) => {
          console.debug("Holding...", event)
          props.openLauncherMenu({ position: { left: event.x, top: event.y } })
        }}/>
    </div>
  )
}

export default connect(null, { openLauncherMenu })(Spectacle)
