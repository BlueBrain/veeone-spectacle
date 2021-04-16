import * as React from "react"

import * as styles from "./ContentBlock.module.scss"
import { FrameSituation } from "../common/types"


interface ContentBlockProps {
  frameSituation: FrameSituation
}

const ContentBlock = (props: ContentBlockProps) => {
  const { left, top, isTransforming, isFullscreen, cssTransitionEnabled, angle, scale } = props.frameSituation
  return (
    <div
      className={`${styles.ContentBlock}
        ${isFullscreen ? styles.IsFullscreen : ``}
        ${cssTransitionEnabled ? styles.AfterFullscreen : ``}
        ${isTransforming ? styles.IsTransforming : ``}`}
      ref={props.getRef} style={{
      left: isFullscreen ? `0` : ``,
      top: isFullscreen ? `0` : ``,
      width: isFullscreen ? `100%` : `${props.frameSituation.width}px`,
      height: isFullscreen ? `100%` : `${props.frameSituation.height}px`,
      transform: `${isFullscreen ? `` : `translate(${left}px, ${top}px)`} rotate(${isFullscreen ? 0 : angle}deg) scale(${isFullscreen ? 1 : scale})`,
    }}>
      <div className={styles.BodyWrapper}>
        <div className={styles.Body}
             style={{
               fontSize: "4rem", width: "100%", height: "100%", display: "flex",
               alignItems: "center",
               justifyContent: "center",
             }}>🧠
        </div>
      </div>
    </div>
  )
}

export default ContentBlock
