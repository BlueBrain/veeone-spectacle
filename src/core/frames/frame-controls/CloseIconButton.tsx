import { Close } from "@mui/icons-material"
import { IconButton, Tooltip } from "@mui/material"
import React, { forwardRef, useRef } from "react"
import { controlBarButtonSx } from "./common"

interface CloseIconButtonProps {
  isVisible: boolean
}

const CloseIconButton: React.FC<CloseIconButtonProps> = (
  { isVisible },
  ref
) => {
  return (
    <Tooltip title="Close" enterDelay={1000}>
      <span>
        <IconButton
          ref={ref}
          sx={{
            ...controlBarButtonSx,
            display: isVisible ? "inline-flex" : "none",
          }}
        >
          <Close />
        </IconButton>
      </span>
    </Tooltip>
  )
}
const CloseIconButtonWithRef = forwardRef(CloseIconButton)

export default CloseIconButtonWithRef
