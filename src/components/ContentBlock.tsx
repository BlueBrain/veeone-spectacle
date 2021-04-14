import * as React from "react"

import * as styles from "./ContentBlock.module.scss"
import reactable from "reactablejs"

interface Coordinate {
  x: number
  y: number
  width: number
  height: number
}

interface ContentBlockProps {
  coordinate: Coordinate
}

const ContentBlock = (props: ContentBlockProps) => {
  return (
    <div className={styles.ContentBlock} ref={props.getRef} style={{
      left: `${props.coordinate.x}px`,
      top: `${props.coordinate.y}px`,
      width: `${props.coordinate.width}px`,
      height: `${props.coordinate.height}px`,
    }}>
      HELLO I'M BLOCK
    </div>
  )
}

export default ContentBlock
