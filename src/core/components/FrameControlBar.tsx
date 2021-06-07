import React from "react"
import styled from "styled-components"
import { faTimes } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

interface FrameControlBarProps {
  onClose(): void
}

const StyledFrameControlBar = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  z-index: 999;
  padding: 5px;
  box-sizing: border-box;
  transform: translateY(-100%);
`

const StyledCloseButton = styled.button`
  background: rgba(255, 255, 255, 0.2);
  color: rgba(0, 0, 0, 0.7);
  border: none;
  border-radius: 3rem;
  aspect-ratio: 1;
`

const FrameControlBar: React.FC<FrameControlBarProps> = (
  props: FrameControlBarProps
) => {
  const close = () => props.onClose()

  return (
    <StyledFrameControlBar>
      <StyledCloseButton type={"button"} onClick={close}>
        <FontAwesomeIcon icon={faTimes} />
      </StyledCloseButton>
    </StyledFrameControlBar>
  )
}

export default FrameControlBar
