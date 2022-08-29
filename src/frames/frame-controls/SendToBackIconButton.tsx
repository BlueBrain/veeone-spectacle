import { FlipToBack } from "@mui/icons-material"
import { IconButton, Tooltip } from "@mui/material"
import React, { forwardRef } from "react"
import { controlBarButtonSx } from "./common"

interface SendToBackIconButtonProps {
  isVisible: boolean
}

const SendToBackIconButton: React.FC<SendToBackIconButtonProps> = (
  { isVisible },
  ref
) => {
  return (
    <Tooltip title="Send to back" enterDelay={1000}>
      <span>
        <IconButton
          ref={ref}
          sx={{
            ...controlBarButtonSx,
            display: isVisible ? "inline-flex" : "none",
          }}
        >
          <FlipToBack />
        </IconButton>
      </span>
    </Tooltip>
  )
}
const SendToBackIconButtonWithRef = forwardRef(SendToBackIconButton)

export default SendToBackIconButtonWithRef
