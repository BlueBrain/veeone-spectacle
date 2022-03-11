import { Box } from "@mui/material"
import React, { useMemo } from "react"
import { useSpectacle, ViewMode } from "../../spectacle/SpectacleContext"
import SceneCarouselItem from "./SceneCarouselItem"
import SceneCarouselItemToolbar from "./SceneCarouselItemToolbar"

const SceneCarouselNavigator: React.FC = () => {
  const {
    sceneIds,
    viewMode,
    activeSceneIndex,
    presentationStore,
  } = useSpectacle()
  const viewport = presentationStore.meta.viewport

  const isScenesOverviewMode = useMemo(
    () => viewMode === ViewMode.SceneOverview,
    [viewMode]
  )

  const sceneCarouselItems = useMemo(
    () =>
      sceneIds.map((sceneId, i) => (
        <SceneCarouselItem sceneId={sceneId} index={i} key={i} />
      )),
    [sceneIds]
  )

  const sceneCarouselItemOptions = useMemo(
    () =>
      sceneIds.map((sceneId, i) => (
        <SceneCarouselItemToolbar sceneId={sceneId} index={i} key={i} />
      )),
    [sceneIds]
  )

  return (
    <Box
      sx={{
        width: `100%`,
        display: "flex",
        flexDirection: "row",
        flexWrap: "nowrap",
        whiteSpace: "nowrap",
        transition: `transform ease 1000ms`,
      }}
    >
      {sceneCarouselItemOptions}
      <Box
        sx={{
          width: "100%",
          display: "flex",
          position: "relative",
          transition: `transform ease 1000ms`,
          transform: `
          ${
            isScenesOverviewMode
              ? `
            scale(40%)
            translateY(-50%)`
              : ``
          }
          translateX(${-activeSceneIndex * viewport.width}px)
      `,
        }}
      >
        {sceneCarouselItems}
      </Box>
    </Box>
  )
}

export default SceneCarouselNavigator
