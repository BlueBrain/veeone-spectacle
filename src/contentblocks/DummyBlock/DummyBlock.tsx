import * as React from "react"
import { connect } from "react-redux"
import { getFrame } from "../../core/redux/selectors"
import { FrameId, FrameSituation, PresentationStateData } from "../../core/presentations/interfaces"
import styled from "styled-components"
import { useState } from "react"

interface StateProps {
  situation: FrameSituation
}

interface DummyBlockProps {
  frameId: FrameId
}

type Props = DummyBlockProps & StateProps

const StyledBodyWrapper = styled.div`
position: absolute;
  width: 100%;
  height: 100%;`

const StyledBody = styled.div`
contain: content;
  position: absolute;
  width: 100%;
  height: 100%;
  background: #fff;
  box-shadow: 0px 5px 10px rgba(0, 0, 0, .3);`

const StyledContentBlock = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
`

const DummyBlock = (props: Props) => {
  const [counter, setCounter] = useState(0)
  const { width, height, left, top, isFullscreen, angle } = props.situation

  return (
    <StyledContentBlock>

      <StyledBodyWrapper>
        <StyledBody>
          content body {counter}
          <button type={"button"} onClick={() => setCounter(prev => prev + 1)}>Add counter</button>
          <div>left={left}</div>
          <div>top={top}</div>
          <div>width={width}</div>
          <div>height={height}</div>
          <div>angle={angle}</div>
          <div>fullscreen={isFullscreen ? "true" : "false"}</div>
        </StyledBody>
      </StyledBodyWrapper>

    </StyledContentBlock>
  )
}

const mapStateToProps = (state: PresentationStateData, ownProps: DummyBlockProps) => {
  console.debug("state", state, "ownProps", ownProps)
  return {
    situation: getFrame(state, ownProps.frameId).situation,
  }
}

export default connect(mapStateToProps)(DummyBlock)
