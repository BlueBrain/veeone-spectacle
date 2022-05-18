import { Box } from "@mui/material"
import React from "react"

interface BlurredImageBackgroundProps {
  imageUrl: string
}

const BlurredImageBackground: React.FC<BlurredImageBackgroundProps> = ({
  imageUrl,
}) => {
  return (
    <Box
      sx={{
        position: `absolute`,
        left: 0,
        top: 0,
        width: `100%`,
        height: `100%`,
        overflow: `hidden`,
      }}
    >
      <Box
        sx={{
          background: `url("${imageUrl}") center`,
          filter: `blur(10px)`,
          opacity: "0.8",
          backgroundRepeat: `no-repeat`,
          backgroundSize: `cover`,
          width: `100%`,
          height: `100%`,
          transform: "scale(120%)",
        }}
      />
    </Box>
  )
}

export default BlurredImageBackground
