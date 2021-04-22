import React from "react"
import styled from "styled-components"

interface FrameControlBarProps {
  onClose(): void
}

const StyledFrameControlBar = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  z-index: 999;
  padding: 5px;
  opacity: .5;
  box-sizing: border-box;
  transform: translateY(-100%);
`

const FrameControlBar: React.FC<FrameControlBarProps> = (props: FrameControlBarProps) => {
  const close = () => props.onClose()

  return <StyledFrameControlBar>
    <button type={"button"} onClick={close}>X</button>
  </StyledFrameControlBar>
}

export default FrameControlBar
