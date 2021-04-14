import * as React from "react"

import * as styles from "./Desk.module.scss"
import Frame from "./Frame"
import LauncherMenu from "./LauncherMenu"

const Desk: React.FC = (props) => {


  return (
    <div className={styles.Desk} ref={props.getRef}>
      <Frame initPosition={{x: 100, y: 200}}/>
      <Frame initPosition={{x: 600, y: 400}}/>
      <Frame initPosition={{x: 300, y: 600}}/>

      <LauncherMenu/>
    </div>
  )
}

export default Desk
