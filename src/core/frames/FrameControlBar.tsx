import React from "react"
import styled from "styled-components"
import { Close, FlipToBack } from "@material-ui/icons"
import { IconButton } from "@material-ui/core"

interface FrameControlBarProps {
  onClose(): void
  onSendToBack(): void
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

  const sendToBack = event => {
    props.onSendToBack()
    event.stopPropagation()
  }

  return (
    <StyledFrameControlBar>
      <IconButton type={"button"} onClick={close} size={"small"}>
        <Close />
      </IconButton>
      <IconButton type={"button"} onClick={sendToBack} size={"small"}>
        <FlipToBack />
      </IconButton>
    </StyledFrameControlBar>
  )
}

export default FrameControlBar
