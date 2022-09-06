import { Box } from "@mui/material"
import React, { useMemo } from "react"
import { useSpectacle, ViewMode } from "../../spectacle/SpectacleStateContext"
import SceneCarouselItem from "./SceneCarouselItem"
import SceneCarouselItemToolbar from "./SceneCarouselItemToolbar"
import { AddRounded } from "@mui/icons-material"
import { useScenes } from "../SceneContext"

const SceneCarouselNavigator: React.FC = () => {
  const { viewMode, presentationStore } = useSpectacle()

  const { activeSceneIndex, sceneIds, addNewScene } = useScenes()

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

  const sceneCarouselItemToolbar = useMemo(
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
      {sceneCarouselItemToolbar}
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
        <Box
          sx={{
            width: `${viewport.width}px`,
            height: `${viewport.height}px`,
            // boxShadow: `0 3rem 4rem rgba(0, 0, 0, .4)`,
            background: `rgba(255, 255, 255, .02)`,
            flexShrink: 0,
            position: "relative",
            transform: `scale(0.8)`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "dashed 2rem rgba(255, 255, 255, .05)",
            boxSizing: "border-box",
            transition: `background ease 500ms`,
            "&:hover": {
              background: `rgba(255, 255, 255, .1)`,
            },
          }}
          onClick={addNewScene}
        >
          <AddRounded
            sx={{ fontSize: "20rem", color: `rgba(255, 255, 255, .06)` }}
          />
        </Box>
      </Box>
    </Box>
  )
}

export default SceneCarouselNavigator
