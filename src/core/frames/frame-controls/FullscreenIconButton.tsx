import { Close, Fullscreen } from "@mui/icons-material"
import { IconButton, Tooltip } from "@mui/material"
import React, { forwardRef, useRef } from "react"
import { controlBarButtonSx } from "./common"

interface FullscreenIconButtonProps {
  isVisible: boolean
}

const FullscreenIconButton: React.FC<FullscreenIconButtonProps> = (
  { isVisible },
  ref
) => {
  return (
    <Tooltip title="Fullscreen">
      <IconButton
        ref={ref}
        sx={{
          ...controlBarButtonSx,
          display: isVisible ? "inline-flex" : "none",
        }}
      >
        <Fullscreen />
      </IconButton>
    </Tooltip>
  )
}
const FullscreenIconButtonWithRef = forwardRef(FullscreenIconButton)

export default FullscreenIconButtonWithRef
