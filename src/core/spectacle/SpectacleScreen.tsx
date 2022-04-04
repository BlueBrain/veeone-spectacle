import React from "react"
import { Box } from "@mui/material"
import SceneCarouselNavigator from "../scenes/scene-carousel-navigator"
import SceneDeskNavigation from "../scenes/SceneDeskNavigation"
import SavePresentationModal from "../../presentation-loader/SavePresentationModal"
import OpenPresentationModal from "../../presentation-loader/OpenPresentationModal"
import { useSpectacle } from "./SpectacleContext"
import { useConfig } from "../../config/AppConfigContext"

const SpectacleScreen: React.FC = () => {
  const config = useConfig()
  const { openPresentation, savePresentation } = useSpectacle()
  return (
    <Box
      className={"SpectacleScreen"}
      sx={{
        background: theme => theme.palette.screen.main,
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

      {savePresentation.isModalOpen ? <SavePresentationModal /> : null}

      {openPresentation.isModalOpen ? <OpenPresentationModal /> : null}
    </Box>
  )
}
export default SpectacleScreen
