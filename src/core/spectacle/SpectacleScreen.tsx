import React, { useMemo, useRef } from "react"
import { Box } from "@mui/material"
import { Desk } from "../desk"
import { config } from "../../config"
import { useSpectacle, ViewMode } from "./SpectacleContext"
import useInteractable from "../interactable/useInteractable"

const SpectacleScreen: React.FC = () => {
  const { viewMode, setViewMode } = useSpectacle()

  const showScenesOverview = useMemo(
    () => viewMode === ViewMode.SceneOverview,
    [viewMode]
  )

  const screenRef = useRef()

  useInteractable(screenRef, {
    onTap: () => {
      if (viewMode === ViewMode.SceneOverview) {
        setViewMode(ViewMode.Desk)
      }
    },
  })

  return (
    <Box
      className={"SpectacleScreen"}
      sx={{
        background: `rgba(30, 30, 30, 1)`,
        width: `${config.VIEWPORT_WIDTH}px`,
        height: `${config.VIEWPORT_HEIGHT}px`,
        overflow: "hidden",
        contain: `content`,
      }}
    >
      <Box
        ref={screenRef}
        sx={{
          width: `100%`,
          height: `100%`,
          transition: `transform ease 1000ms`,
          boxShadow: `0 2rem 4rem rgba(0,0,0,.4)`,
          ...(showScenesOverview
            ? {
                transform: `scale(60%) translateY(-10%)`,
              }
            : {}),
        }}
      >
        <Desk />
      </Box>
    </Box>
  )
}
export default SpectacleScreen
