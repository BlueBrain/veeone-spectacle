import * as React from "react"

import * as styles from "./ContentBlock.module.scss"
import { FrameSituation } from "../common/types"


interface ContentBlockProps {
  frameSituation: FrameSituation
}

const ContentBlock = (props: ContentBlockProps) => {
  const { isTransforming, isFullscreen, cssTransitionEnabled, angle, scale } = props.frameSituation
  return (
    <div
      className={`${styles.ContentBlock}
        ${isFullscreen ? styles.IsFullscreen : ``}
        ${cssTransitionEnabled ? styles.AfterFullscreen : ``}
        ${isTransforming ? styles.IsTransforming : ``}`}
      ref={props.getRef} style={{
      left: isFullscreen ? `0` : `${props.frameSituation.left}px`,
      top: isFullscreen ? `0` : `${props.frameSituation.top}px`,
      width: isFullscreen ? `100%` : `${props.frameSituation.width}px`,
      height: isFullscreen ? `100%` : `${props.frameSituation.height}px`,
      transform: `rotate(${isFullscreen ? 0 : angle}deg) scale(${isFullscreen ? 1 : scale})`,
    }}>
      <div className={styles.Body}>
        <div style={{
          fontSize: "4rem", width: "100%", height: "100%", display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundImage: "https://actu.epfl.ch/image/72105/1108x622.jpg",
          backgroundRepeat: "no-repeat",
        }}>🧠</div>
      </div>
    </div>
  )
}

export default ContentBlock
