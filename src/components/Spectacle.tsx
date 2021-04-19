import * as React from "react"
import { Helmet } from "react-helmet"
import * as styles from "./Spectacle.module.scss"
import Desk from "./Desk"

interface SpectacleProps {}


type Props = SpectacleProps

const Spectacle = (props: Props) => {
  return (
    <div className={styles.Spectacle}>
      <Helmet>
        <meta name="viewport" content="initial-scale=1.0, maximum-scale=1.0, user-scalable=no"/>
      </Helmet>
      <Desk/>
    </div>
  )
}

export default Spectacle
