import React, { useContext } from "react"
import { Close, FlipToBack, Fullscreen } from "@mui/icons-material"
import { IconButton, Tooltip } from "@mui/material"
import { styled } from "@mui/material/styles"
import FrameContext from "./FrameContext"

interface FrameControlBarProps {
  floating?: boolean
}

interface StyledFrameControlBarProps {
  floating: number
}

const StyledFrameControlBar = styled("div")(
  ({ floating }: StyledFrameControlBarProps) => ({
    padding: ".5rem .3rem",
    ...(floating
      ? {
          position: "absolute",
          left: 0,
          top: 0,
        }
      : {}),
  })
)

const FrameControlIconButton = styled(IconButton)(({ theme }) => ({
  padding: ".2rem",
  margin: "0 .2rem",
  background: theme.palette.primary.main,
  svg: {
    fill: "white",
  },
  "&:hover": {
    opacity: 1,
    background: theme.palette.primary.dark,
  },
}))

const CloseIconButton = styled(FrameControlIconButton)(({ theme }) => ({
  background: theme.palette.error.main,
}))

const FullscreenIconButton = styled(FrameControlIconButton)(({ theme }) => ({
  // background: theme.palette.primary.main,
}))

const SendToBackIconButton = styled(FrameControlIconButton)(({ theme }) => ({
  // background: theme.palette.primary.main,
}))

const FrameControlBar: React.FC<FrameControlBarProps> = ({
  floating = false,
}) => {
  const { toggleFullscreen, close, sendToBack } = useContext(FrameContext)

  const handleSendToBack = event => {
    sendToBack()
    event.stopPropagation()
  }

  return (
    <StyledFrameControlBar floating={floating ? 1 : 0}>
      <Tooltip title="Close">
        <CloseIconButton type={"button"} onClick={close}>
          <Close />
        </CloseIconButton>
      </Tooltip>
      <Tooltip title="Send to back">
        <SendToBackIconButton type={"button"} onClick={handleSendToBack}>
          <FlipToBack />
        </SendToBackIconButton>
      </Tooltip>
      <Tooltip title="Fullscreen">
        <FullscreenIconButton type={"button"} onClick={toggleFullscreen}>
          <Fullscreen />
        </FullscreenIconButton>
      </Tooltip>
    </StyledFrameControlBar>
  )
}

export default FrameControlBar
