import * as React from "react"

import * as styles from "./ContentBlock.module.scss"
import { FrameId, FrameSituation } from "../common/types"
import FrameControlBar from "./FrameControlBar"
import { connect } from "react-redux"
import { closeFrame } from "../redux/actions"

interface DispatchProps {
  closeFrame(frameId: FrameId): void
}

interface ContentBlockProps {
  frameId: FrameId
  frameSituation: FrameSituation
}

type Props = ContentBlockProps & DispatchProps

const ContentBlock = (props: Props) => {
  const { left, top, isTransforming, isFullscreen, cssTransitionEnabled, angle } = props.frameSituation

  const onCloseFrame = () => {
    console.debug("Close this frame")
    props.closeFrame(props.frameId)
  }

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
      <FrameControlBar onClose={onCloseFrame}/>
      <div className={styles.BodyWrapper}>
        <div className={styles.Body}>
          content body
        </div>
      </div>
    </div>
  )
}

export default connect(null, { closeFrame })(ContentBlock)
