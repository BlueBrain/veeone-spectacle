import * as React from "react"

import * as styles from "./ContentBlock.module.scss"
import { FrameId, FrameSituation } from "../common/types"
import FrameControlBar from "./FrameControlBar"
import { connect } from "react-redux"
import { closeFrame } from "../redux/actions"
import { getFrame } from "../redux/selectors"
import { PresentationStateData } from "../presentations/interfaces"
import styled from "styled-components"

interface DispatchProps {
  closeFrame(frameId: FrameId): void
}

interface StateProps {
  situation: FrameSituation
}

interface ContentBlockProps {
  frameId: FrameId

  getRef(): HTMLElement
}

type Props = ContentBlockProps & StateProps & DispatchProps

const StyledContentBlock = styled.div(({ isFullscreen, width, height, left, top, angle }) => `
  position: absolute;
  width: ${isFullscreen ? `100%` : `${width}px`};
  height: ${isFullscreen ? `100%` : `${height}px`};
  transform: ${isFullscreen ? `` : `translateX(${left}px) translateY(${top}px) rotate(${angle}deg)`}
`)

const ContentBlock = (props: Props) => {
  const { width, height, left, top, isFullscreen, angle } = props.situation

  const onCloseFrame = () => {
    console.debug("Close this frame")
    props.closeFrame(props.frameId)
  }

  return (
    <StyledContentBlock
      isFullscreen={isFullscreen}
      width={width} height={height}
      left={left} top={top}
      angle={angle}
      ref={props.getRef}>

      <FrameControlBar onClose={onCloseFrame}/>

      <div className={styles.BodyWrapper}>
        <div className={styles.Body}>
          content body
          <div>left={left}</div>
          <div>top={top}</div>
          <div>width={width}</div>
          <div>height={height}</div>
          <div>angle={angle}</div>
          <div>fullscreen={isFullscreen ? "true" : "false"}</div>
        </div>
      </div>

    </StyledContentBlock>
  )
}

const mapStateToProps = (state: PresentationStateData, ownProps: ContentBlockProps) => {
  console.debug("state", state, "ownProps", ownProps)
  return {
    situation: getFrame(state, ownProps.frameId).situation,
  }
}

export default connect(mapStateToProps, { closeFrame })(ContentBlock)
