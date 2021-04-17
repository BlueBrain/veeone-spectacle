import * as React from "react"

import * as styles from "./ContentBlock.module.scss"
import { FrameSituation } from "../common/types"
import FrameControlBar from "./FrameControlBar"


interface ContentBlockProps {
  frameSituation: FrameSituation
}

const ContentBlock = (props: ContentBlockProps) => {
  const { left, top, isTransforming, isFullscreen, cssTransitionEnabled, angle } = props.frameSituation
  return (
    <div
      className={`${styles.ContentBlock}
        ${isFullscreen ? styles.IsFullscreen : ``}
        ${cssTransitionEnabled ? styles.AfterFullscreen : ``}
        ${isTransforming ? styles.IsTransforming : ``}`}
      ref={props.getRef} style={{
      width: isFullscreen ? `100%` : `${props.frameSituation.width}px`,
      height: isFullscreen ? `100%` : `${props.frameSituation.height}px`,
      transform: `${isFullscreen ? `` : `translateX(${left}px) translateY(${top}px) rotate(${angle}deg)`}`,
    }}>
      <FrameControlBar/>
      <div className={styles.BodyWrapper}>
        <div className={styles.Body}>
          content body
        </div>
      </div>
    </div>
  )
}

export default ContentBlock
