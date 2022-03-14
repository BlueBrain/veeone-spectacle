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

const FrameControlBar: React.FC = () => {
  const { scene } = useDesk()

  const {
    toggleFullscreen,
    close,
    sendToBack,
    frameId,
    isFullscreen,
  } = useContext(FrameContext)

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
        {
          padding: ".5rem .3rem",
          transition: `opacity ease 500ms`,
        },
        isTopFrame && !isFullscreen
          ? {
              opacity: 1,
            }
          : isFullscreen
          ? { opacity: 0 }
          : {
              opacity: 0.4,
            },
        {
          ...(!isTopFrame
            ? {
                ".MuiIconButton-root": {
                  background: `rgba(0, 0, 0, .7)`,
                },
              }
            : {}),
        },
      ]}
    >
      <SendToBackIconButtonWithRef isVisible={isTopFrame} ref={sendToBackRef} />
      <FullscreenIconButtonWithRef isVisible={isTopFrame} ref={fullscreenRef} />
      <CloseIconButtonWithRef isVisible={true} ref={closeRef} />
    </Box>
  )
}

export default FrameControlBar
