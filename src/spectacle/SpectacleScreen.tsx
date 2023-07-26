import React, { useEffect, useRef } from "react"
import { Box } from "@mui/material"
import SceneCarouselNavigator from "../scenes/scene-carousel-navigator"
import SceneDeskNavigation from "../scenes/SceneDeskNavigation"
import { useSpectacle } from "./SpectacleStateContext"

export const systemStats = {
  lastUserActivityAt: null,
}

const SpectacleScreen: React.FC = () => {
  const { isOnline, presentationStore, screenRef } = useSpectacle()

  useEffect(() => {
    const currentRef = screenRef.current as HTMLElement
    const tapHandler = () => {
      systemStats.lastUserActivityAt = Date.now()
    }
    if (currentRef) {
      currentRef.addEventListener("pointerdown", tapHandler)
    }
    return () => {
      currentRef.removeEventListener("pointerdown", tapHandler)
    }
  }, [screenRef])

  return (
    <Box
      className={"SpectacleScreen"}
      ref={screenRef}
      sx={{
        background: theme => theme.palette.screen.main,
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: `${presentationStore.meta.viewport.width}px`,
        height: `${presentationStore.meta.viewport.height}px`,
        overflow: "hidden",
        contain: `content`,
        filter: isOnline ? "" : "grayscale(100%)",
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
