import React, { useContext, useMemo, useRef } from "react"
import { Box } from "@mui/material"
import FrameContext from "./FrameContext"
import useInteractable from "../interactable/useInteractable"
import CloseIconButtonWithRef from "./frame-controls/CloseIconButton"
import FullscreenIconButtonWithRef from "./frame-controls/FullscreenIconButton"
import SendToBackIconButtonWithRef from "./frame-controls/SendToBackIconButton"
import { useDesk } from "../desk/DeskContext"

export interface FrameControlBarProps {
  isFullscreenButtonVisible?: boolean
  isSendToBackButtonVisible?: boolean
  isCloseButtonVisible?: boolean
}

const FrameControlBar: React.FC<FrameControlBarProps> = ({
  isFullscreenButtonVisible = true,
  isSendToBackButtonVisible = true,
  isCloseButtonVisible = true,
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
        {
          padding: ".5rem .3rem",
          transition: `opacity ease 500ms`,
        },
        isTopFrame
          ? {
              opacity: 1,
            }
          : {
              opacity: 0.6,
            },
        {
          ".MuiIconButton-root": {
            transition: `transform ease 500ms`,
          },
          ...(!isTopFrame
            ? {
                ".MuiIconButton-root": {
                  background: `rgba(0, 0, 0, .5)`,
                  transform: "scale(80%)",
                },
              }
            : {}),
        },
      ]}
    >
      <SendToBackIconButtonWithRef
        isVisible={Boolean(isTopFrame && isSendToBackButtonVisible)}
        ref={sendToBackRef}
      />
      <FullscreenIconButtonWithRef
        isVisible={Boolean(isTopFrame && isFullscreenButtonVisible)}
        ref={fullscreenRef}
      />
      <CloseIconButtonWithRef
        isVisible={Boolean(isCloseButtonVisible)}
        ref={closeRef}
      />
    </Box>
  )
}

export default FrameControlBar
