import React, { useContext, useMemo, useRef } from "react"
import { Box } from "@mui/material"
import FrameContext from "./FrameContext"
import useInteractable from "../interactable/useInteractable"
import CloseIconButtonWithRef from "./frame-controls/CloseIconButton"
import FullscreenIconButtonWithRef from "./frame-controls/FullscreenIconButton"
import SendToBackIconButtonWithRef from "./frame-controls/SendToBackIconButton"
import { useConfig } from "../config/AppConfigContext"
import { useScenes } from "../scenes/SceneContext"

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
  const config = useConfig()
  const { activeScene } = useScenes()

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
    () =>
      activeScene.frameStack.indexOf(frameId) ===
      activeScene.frameStack.length - 1,
    [frameId, activeScene.frameStack]
  )

  const isControlBarAlwaysVisible = useMemo(
    () => config.FRAME_CONTROLS_ALWAYS_VISIBLE,
    [config.FRAME_CONTROLS_ALWAYS_VISIBLE]
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
            ? isControlBarAlwaysVisible
              ? {
                  ".MuiIconButton-root": {
                    background: `rgba(0, 0, 0, .5)`,
                    transform: "scale(80%)",
                  },
                }
              : {
                  ".MuiIconButton-root": {
                    display: `none`,
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
