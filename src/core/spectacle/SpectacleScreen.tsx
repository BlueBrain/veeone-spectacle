import React, { useCallback } from "react"
import { Box, Button } from "@mui/material"
import { config } from "../../config"
import { useSpectacle } from "./SpectacleContext"
import SceneCarouselNavigator from "../scenes/scene-carousel-navigator"

const SpectacleScreen: React.FC = () => {
  const { sceneManager } = useSpectacle()

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

        <Button onClick={previousScene} variant={"contained"}>
          Previous scene
        </Button>

        <Button onClick={nextScene} variant={"contained"}>
          Next scene
        </Button>
      </Box>
      <SceneCarouselNavigator />
    </Box>
  )
}
export default SpectacleScreen
