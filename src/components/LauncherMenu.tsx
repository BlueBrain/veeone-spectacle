import * as React from "react"

import * as styles from "./LauncherMenu.module.scss"

const LauncherMenu = (props) => {
  return (
    <div className={styles.LauncherMenu} ref={props.getRef}>
      Open frame
    </div>
  )
}

export default LauncherMenu
