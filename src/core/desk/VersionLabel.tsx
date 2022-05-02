import React, { useMemo } from "react"
import { Box, Theme } from "@mui/material"
import { useConfig } from "../../config/AppConfigContext"
import { SxProps } from "@mui/system"

const VersionLabel: React.FC = () => {
  const config = useConfig()
  const sx = useMemo<SxProps<Theme>>(
    () => ({
      position: `absolute`,
      color: theme => theme.palette.secondary.main,
      bottom: `1rem`,
      left: "50%",
      transform: `translateX(-50%)`,
      opacity: 0.5,
      fontSize: `0.8rem`,
    }),
    []
  )
  return (
    <Box sx={sx}>
      {config.VERSION} ({config.REVISION})
    </Box>
  )
}

export default VersionLabel
