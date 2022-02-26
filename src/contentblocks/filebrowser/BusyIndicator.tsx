import { Box, CircularProgress } from "@mui/material"
import React from "react"

interface FileSystemBusyIndicatorProps {}

const BusyIndicator: React.FC<FileSystemBusyIndicatorProps> = () => {
  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        top: 0,
        left: 0,
      }}
    >
      <CircularProgress
        sx={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transition: "translate(-50%, -50%)",
        }}
      />
    </Box>
  )
}

export default BusyIndicator
