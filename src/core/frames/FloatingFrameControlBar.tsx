import React from "react"
import { Box } from "@mui/material"
import FrameControlBar from "./FrameControlBar"

const FloatingFrameControlBar: React.FC = props => (
  <Box
    sx={{
      position: "absolute",
      right: 0,
      top: 0,
      transform: "translateY(-50%) translateX(1.3rem)",
    }}
  >
    <FrameControlBar {...props} />
  </Box>
)

export default FloatingFrameControlBar
