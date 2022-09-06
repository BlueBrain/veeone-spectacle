import React, { useCallback, useMemo } from "react"
import { Box, IconButton } from "@mui/material"
import { useSpectacle, ViewMode } from "../spectacle/SpectacleStateContext"
import { ChevronLeft, ChevronRight } from "@mui/icons-material"
import { useScenes } from "./SceneContext"

const SceneDeskNavigation: React.FC = () => {
  const { viewMode } = useSpectacle()
  const {
    activeSceneIndex,
    sceneIds,
    switchToNextScene,
    switchToPreviousScene,
  } = useScenes()

  const goToPreviousScene = useCallback(() => {
    switchToPreviousScene()
  }, [switchToPreviousScene])

  const goToNextScene = useCallback(() => {
    switchToNextScene()
  }, [switchToNextScene])

  const canGoLeft = useMemo(() => activeSceneIndex > 0, [activeSceneIndex])

  const canGoRight = useMemo(() => activeSceneIndex + 1 < sceneIds.length, [
    activeSceneIndex,
    sceneIds.length,
  ])

  return (
    <Box
      sx={{
        opacity: viewMode === ViewMode.Desk ? 0.3 : 0,
        visibility:
          canGoLeft || (canGoRight && viewMode === ViewMode.Desk)
            ? "visible"
            : "hidden",
        transition: `opacity ease 1000ms`,
        transform: "translateY(-50%)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <IconButton
        disabled={!canGoLeft}
        onClick={goToPreviousScene}
        size={"large"}
        sx={{
          opacity: canGoLeft ? 1 : 0.4,
          transition: "opacity ease 300ms",
        }}
      >
        <ChevronLeft
          sx={{
            color: "white",
          }}
        />
      </IconButton>
      <IconButton
        onClick={goToNextScene}
        disabled={!canGoRight}
        size={"large"}
        sx={{
          opacity: canGoRight ? 1 : 0.4,
          transition: "opacity ease 300ms",
        }}
      >
        <ChevronRight
          sx={{
            color: "white",
          }}
        />
      </IconButton>
    </Box>
  )
}

export default SceneDeskNavigation
