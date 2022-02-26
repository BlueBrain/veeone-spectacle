import { Close, FlipToBack, Fullscreen } from "@mui/icons-material"
import { IconButton, Tooltip } from "@mui/material"
import React, { forwardRef, useRef } from "react"
import { controlBarButtonSx } from "./common"

interface SendToBackIconButtonProps {
  isVisible: boolean
}

const SendToBackIconButton: React.FC<SendToBackIconButtonProps> = (
  { isVisible },
  ref
) => {
  return (
    <Tooltip title="Send to back">
      <IconButton
        ref={ref}
        sx={{
          ...controlBarButtonSx,
          display: isVisible ? "inline-flex" : "none",
        }}
      >
        <FlipToBack />
      </IconButton>
    </Tooltip>
  )
}
const SendToBackIconButtonWithRef = forwardRef(SendToBackIconButton)

export default SendToBackIconButtonWithRef
