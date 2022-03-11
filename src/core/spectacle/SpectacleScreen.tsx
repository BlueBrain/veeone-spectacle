import React from "react"
import { Box } from "@mui/material"
import { config } from "../../config"
import SceneCarouselNavigator from "../scenes/scene-carousel-navigator"

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
    </Box>
  )
}
export default SpectacleScreen
