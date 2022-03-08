import React, { useCallback, useMemo, useRef } from "react"
import { Box, Button } from "@mui/material"
import { config } from "../../config"
import { useSpectacle, ViewMode } from "./SpectacleContext"
import useInteractable from "../interactable/useInteractable"
import Scene from "../scenes"

const SpectacleScreen: React.FC = () => {
  const {
    viewMode,
    setViewMode,
    sceneManager,
    activeSceneId,
    nextSceneId,
    previousSceneId,
  } = useSpectacle()

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

  const addNewScene = useCallback(() => {
    sceneManager.addNewScene()
  }, [sceneManager])

  const nextScene = useCallback(() => {
    sceneManager.switchToNextScene()
  }, [sceneManager])

  const previousScene = useCallback(() => {
    sceneManager.switchToPreviousScene()
  }, [sceneManager])

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
      <Box sx={{ position: "absolute" }}>
        <Button onClick={addNewScene} variant={"contained"}>
          Add new scene
        </Button>

        {previousSceneId ? (
          <Button onClick={previousScene} variant={"contained"}>
            Previous scene
          </Button>
        ) : null}

        {nextSceneId ? (
          <Button onClick={nextScene} variant={"contained"}>
            Next scene
          </Button>
        ) : null}
      </Box>
      <Box
        sx={{
          // background: `rgba(255, 0, 0, .2)`,
          width: `100%`,
          height: `100%`,
        }}
      >
        <Box
          ref={screenRef}
          sx={{
            width: `100%`,
            height: `100%`,
            transition: `transform ease 1000ms`,
            // background: "green",
            boxShadow: `0 2rem 4rem rgba(0,0,0,.4)`,
            ...(showScenesOverview
              ? {
                  transform: `scale(60%) translateY(-20%)`,
                }
              : {}),
          }}
        >
          <Scene sceneId={activeSceneId} />
        </Box>
      </Box>
    </Box>
  )
}
export default SpectacleScreen
