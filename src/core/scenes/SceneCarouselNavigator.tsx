import { Box } from "@mui/material"
import React, { useMemo } from "react"
import { useSpectacle, ViewMode } from "../spectacle/SpectacleContext"
import SceneCarouselItem from "./SceneCarouselItem"

const SceneCarouselNavigator: React.FC = () => {
  const {
    sceneIds,
    viewMode,
    activeSceneId,
    activeSceneIndex,
    presentationStore,
  } = useSpectacle()
  const viewport = presentationStore.meta.viewport

  const showScenesOverview = useMemo(
    () => viewMode === ViewMode.SceneOverview,
    [viewMode]
  )

  // const isDeskMode = useMemo(() => viewMode === ViewMode.Desk, [viewMode])
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

  return (
    <Box
      // ref={sceneWrapperRef}
      sx={{
        // background: `rgba(255, 0, 0, .3)`,
        width: `100%`,
        display: "flex",
        flexDirection: "row",
        flexWrap: "nowrap",
        whiteSpace: "nowrap",
        transition: `transform ease 1000ms`,
        transform: `
        ${
          isScenesOverviewMode
            ? `
            scale(40%)
            translateY(-30%)`
            : ``
        }
        `,
      }}
    >
      <Box
        sx={{
          width: "100%",
          display: "flex",
          position: "relative",
          transition: `transform ease 1000ms`,
          transform: `
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
