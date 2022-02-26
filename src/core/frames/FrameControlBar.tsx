import React, { useContext, useRef } from "react"
import { Box } from "@mui/material"
import FrameContext from "./FrameContext"
import useInteractable from "../interactable/useInteractable"
import CloseIconButtonWithRef from "./frame-controls/CloseIconButton"
import FullscreenIconButtonWithRef from "./frame-controls/FullscreenIconButton"
import SendToBackIconButtonWithRef from "./frame-controls/SendToBackIconButton"

export interface FrameControlBarProps {
  showCloseButton?: boolean
  showFullscreenButton?: boolean
  showSendToBackButton?: boolean
}

const FrameControlBar: React.FC<FrameControlBarProps> = ({
  showSendToBackButton = true,
  showCloseButton = true,
  showFullscreenButton = true,
}) => {
  const { toggleFullscreen, close, sendToBack } = useContext(FrameContext)

  const closeRef = useRef()
  const sendToBackRef = useRef()
  const fullscreenRef = useRef()

  useInteractable(closeRef, { onTap: close })
  useInteractable(sendToBackRef, {
    onTap: event => {
      event.stopPropagation()
      sendToBack()
    },
  })
  useInteractable(fullscreenRef, { onTap: toggleFullscreen })

  return (
    <Box sx={{ padding: ".5rem .3rem" }}>
      <SendToBackIconButtonWithRef
        isVisible={showSendToBackButton}
        ref={sendToBackRef}
      />
      <FullscreenIconButtonWithRef
        isVisible={showFullscreenButton}
        ref={fullscreenRef}
      />
      <CloseIconButtonWithRef isVisible={showCloseButton} ref={closeRef} />
    </Box>
  )
}

export default FrameControlBar
