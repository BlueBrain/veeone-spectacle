import * as styles from './FrameControlBar.module.scss'
import React from "react"

interface FrameControlBarProps {
  onClose(): void
}

const FrameControlBar: React.FC<FrameControlBarProps> = (props: FrameControlBarProps) => {
  const close = () => props.onClose()

  return <div className={styles.FrameControlBar}>
    <button type={"button"} onClick={close}>X</button>
  </div>
}

export default FrameControlBar
