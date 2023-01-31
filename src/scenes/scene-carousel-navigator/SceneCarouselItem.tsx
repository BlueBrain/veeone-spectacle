import React, { useCallback, useMemo, useRef } from "react"
import Scene from "../Scene"
import { Box } from "@mui/material"
import { SceneId } from "../../types"
import { useSpectacle, ViewMode } from "../../spectacle/SpectacleStateContext"
import useInteractable from "../../interactable/useInteractable"
import { useScenes } from "../SceneContext"

interface SceneCarouselItemProps {
  index: number
  sceneId: SceneId
}

const SceneCarouselItem: React.FC<SceneCarouselItemProps> = ({
  index,
  sceneId,
}) => {
  const ref = useRef()

  const { presentationStore, viewMode, setViewMode } = useSpectacle()

  const { activeSceneId, setActiveScene } = useScenes()

  const { width, height } = presentationStore.meta.viewport

  const isActive = useMemo(() => activeSceneId === sceneId, [
    activeSceneId,
    sceneId,
  ])

  const activateScene = useCallback(() => {
    if (viewMode === ViewMode.Desk) {
      return
    }
    if (!isActive) {
      setActiveScene({ sceneId })
    } else if (viewMode === ViewMode.SceneOverview) {
      setViewMode(ViewMode.Desk)
    }
  }, [isActive, sceneId, setActiveScene, setViewMode, viewMode])

  useInteractable(ref, { onTap: activateScene })

  return (
    <Box
      key={index}
      ref={ref}
      sx={{
        flexShrink: 0,
        position: "relative",
        width: `${width}px`,
        height: `${height}px`,
        boxShadow: `0 3rem 4rem rgba(0, 0, 0, .4)`,
        transition: `transform ease 1000ms`,
        zIndex: isActive ? 100 : 0,
        transform: `
        ${isActive ? `scale(1)` : `scale(0.8)`}
        `,
      }}
    >
      <Scene sceneId={sceneId} />
    </Box>
  )
}

export default SceneCarouselItem
