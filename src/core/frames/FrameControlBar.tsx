import React from "react"
import styled from "styled-components"
import { Close, FlipToBack } from "@mui/icons-material"
import { IconButton } from "@mui/material"

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
