import * as React from "react"

import * as styles from "./Spectacle.module.scss"
import Desk from "./Desk"

const Spectacle = () => {
  return (
    <div className={styles.Spectacle}>
      <Desk></Desk>
    </div>
  )
}

export default Spectacle
