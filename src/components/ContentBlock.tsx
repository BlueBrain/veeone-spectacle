import * as React from "react"

import * as styles from "./ContentBlock.module.scss"
import { FrameId, FrameSituation } from "../common/types"
import { connect } from "react-redux"
import { getFrame } from "../redux/selectors"
import { PresentationStateData } from "../presentations/interfaces"
import styled from "styled-components"

interface StateProps {
  situation: FrameSituation
}

interface ContentBlockProps {
  frameId: FrameId
}

type Props = ContentBlockProps & StateProps

const StyledContentBlock = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
`

const ContentBlock = (props: Props) => {
  const { width, height, left, top, isFullscreen, angle } = props.situation

  const onCloseFrame = () => {
    console.debug("Close this frame")
    props.closeFrame(props.frameId)
  }

  return (
    <StyledContentBlock>

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

export default connect(mapStateToProps)(ContentBlock)
