import { Box } from "@mui/material"
import React from "react"
import { useConfig } from "../../config/AppConfigContext"

interface BlurredImageBackgroundProps {
  imageUrl: string
}

const BlurredImageBackground: React.FC<BlurredImageBackgroundProps> = ({
  imageUrl,
}) => {
  const { IMAGE_BLUR_BACKGROUND_OPACITY } = useConfig()

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
          opacity: `${IMAGE_BLUR_BACKGROUND_OPACITY}`,
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
