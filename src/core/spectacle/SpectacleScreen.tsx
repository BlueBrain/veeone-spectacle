import React from "react"
import { Box } from "@mui/material"
import { config } from "../../config"
import SceneCarouselNavigator from "../scenes/scene-carousel-navigator"
import SceneDeskNavigation from "../scenes/SceneDeskNavigation"

const SpectacleScreen: React.FC = () => {
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
      <SceneCarouselNavigator />
      <Box sx={{ position: "absolute", left: ".2rem", top: "40%" }}>
        <SceneDeskNavigation />
      </Box>
      <Box sx={{ position: "absolute", right: ".2rem", top: "40%" }}>
        <SceneDeskNavigation />
      </Box>
    </Box>
  )
}
export default SpectacleScreen
