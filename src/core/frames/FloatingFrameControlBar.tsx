import React from "react"
import { Box } from "@mui/material"
import FrameControlBar, { FrameControlBarProps } from "./FrameControlBar"

interface FloatingFrameControlBarProps extends FrameControlBarProps {}
const FloatingFrameControlBar: React.FC<FloatingFrameControlBarProps> = props => (
  <Box sx={{ position: "absolute", right: 0, top: 0 }}>
    <FrameControlBar {...props} />
  </Box>
)

export default FloatingFrameControlBar
