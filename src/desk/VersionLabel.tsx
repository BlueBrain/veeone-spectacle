import React, { useMemo } from "react"
import { Box, Theme } from "@mui/material"
import { useConfig } from "../config/AppConfigContext"
import { SxProps } from "@mui/system"
import { useSpectacle } from "../spectacle/SpectacleContext"

const VersionLabel: React.FC = () => {
  const config = useConfig()

  const { presentationStore, isPresentationClean } = useSpectacle()

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

  const presentationModifiedMarker = isPresentationClean ? "" : "*"

  console.debug(
    "saved at",
    presentationStore.savedAt,
    "updated at",
    presentationStore.updatedAt
  )

  return (
    <Box sx={sx}>
      {config.VERSION} ({config.REVISION}){" "}
      {presentationStore.name || "Untitled"}
      {presentationModifiedMarker}
    </Box>
  )
}

export default VersionLabel
