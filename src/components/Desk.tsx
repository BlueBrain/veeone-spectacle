import * as React from "react"

import * as styles from "./Desk.module.scss"
import Frame from "./Frame"
import LauncherMenu from "./LauncherMenu"

const Desk: React.FC = (props) => {


  return (
    <div className={styles.Desk} ref={props.getRef}>
      <Frame initialPosition={{left: 100, top: 200, width: 300, height: 100}}/>
      <Frame initialPosition={{left: 600, top: 400, width: 100, height: 100}}/>
      <Frame initialPosition={{left: 300, top: 600, width: 50, height: 200}}/>

      <LauncherMenu/>
    </div>
  )
}

export default Desk
