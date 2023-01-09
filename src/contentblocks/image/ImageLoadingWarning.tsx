import React from "react"
import { Box } from "@mui/material"
import { Warning } from "@mui/icons-material"

const ImageLoadingWarning: React.FC = () => {
  return (
    <Box
      sx={{
        width: `100%`,
        height: `100%`,
        position: `absolute`,
        left: 0,
        top: 0,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        color: "white",
        mixBlendMode: "difference",
        overflow: "hidden",
      }}
    >
      <Warning sx={{ fontSize: "2rem" }} />
      <Box sx={{ fontWeight: "bold", textAlign: "center" }}>
        This image
        <br />
        could not be loaded.
      </Box>
    </Box>
  )
}

export default ImageLoadingWarning
