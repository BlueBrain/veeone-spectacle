import * as styles from './FrameControlBar.module.scss'
import React from "react"

const FrameControlBar: React.FC = () => {
  return <div className={styles.FrameControlBar}>
    <button type={"button"} onClick={() => console.debug("EMIT: CLOSE ME")}>X</button>
    <button type={"button"}>---</button>
  </div>
}

export default FrameControlBar
