import * as React from "react"

import * as styles from "./Desk.module.scss"
import Frame from "./Frame"
// import LauncherMenu from "./LauncherMenu"

const Desk: React.FC = (props) => {


  return (
    <div className={styles.Desk} ref={props.getRef}>
      <Frame initialSituation={{left: 100, top: 200, width: 300, height: 100, angle: 0, scale: 1}}/>
      <Frame initialSituation={{left: 600, top: 200, width: 100, height: 100, angle: 0, scale: 1}}/>
      <Frame initialSituation={{left: 300, top: 600, width: 300, height: 200, angle: 0, scale: 1}}/>
      <Frame initialSituation={{left: 400, top: 50, width: 120, height: 120, angle: 0, scale: 1}}/>
      <Frame initialSituation={{left: 500, top: 500, width: 200, height: 200, angle: 0, scale: 1}}/>

      {/*<LauncherMenu/>*/}
    </div>
  )
}

export default Desk
