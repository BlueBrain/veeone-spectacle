import * as React from "react"

import * as styles from "./LauncherMenu.module.scss"

const LauncherMenu = (props) => {
  return (
    <div className={styles.LauncherMenu} ref={props.getRef}>
      <button type={"button"}>Open frame</button>
    </div>
  )
}

export default LauncherMenu
