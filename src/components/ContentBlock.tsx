import * as React from "react"

import * as styles from "./ContentBlock.module.scss"
import {FrameSituation} from "../common/types"


interface ContentBlockProps {
  coordinate: FrameSituation
}

const ContentBlock = (props: ContentBlockProps) => {
  return (
    <div className={`${styles.ContentBlock} ${props.coordinate.isFullscreen ? styles.isFullscreen:``} ${props.coordinate.cssTransitionEnabled ? styles.afterFullscreen:``}`} ref={props.getRef} style={{
      left: props.coordinate.isFullscreen ? `0` : `${props.coordinate.left}px`,
      top: props.coordinate.isFullscreen ? `0` : `${props.coordinate.top}px`,
      width: props.coordinate.isFullscreen ? `100%` : `${props.coordinate.width}px`,
      height: props.coordinate.isFullscreen ? `100%` : `${props.coordinate.height}px`,
    }}>
      HELLO I'M BLOCK
    </div>
  )
}

export default ContentBlock
