import React, { useContext, useMemo, useRef } from "react"
import { Box } from "@mui/material"
import FrameContext from "./FrameContext"
import useInteractable from "../interactable/useInteractable"
import CloseIconButtonWithRef from "./frame-controls/CloseIconButton"
import FullscreenIconButtonWithRef from "./frame-controls/FullscreenIconButton"
import SendToBackIconButtonWithRef from "./frame-controls/SendToBackIconButton"
import { useSelector } from "react-redux"
import { getFrameStack } from "../redux/selectors"
import { useDesk } from "../desk/DeskContext"

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
  const { scene } = useDesk()

  const { toggleFullscreen, close, sendToBack, frameId } = useContext(
    FrameContext
  )

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

  const isTopFrame = useMemo(
    () => scene.frameStack.indexOf(frameId) === scene.frameStack.length - 1,
    [frameId, scene.frameStack]
  )

  return (
    <Box
      sx={[
        { padding: ".5rem .3rem", transition: `opacity ease 500ms` },
        isTopFrame
          ? {
              opacity: 1,
            }
          : {
              opacity: 0.5,
              filter: "grayscale(1)",
            },
      ]}
    >
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
