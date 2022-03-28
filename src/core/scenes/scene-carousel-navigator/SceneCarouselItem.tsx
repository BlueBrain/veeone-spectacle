import React, { useCallback, useMemo, useRef } from "react"
import Scene from "../Scene"
import { Box } from "@mui/material"
import { SceneId } from "../../types"
import { useSpectacle, ViewMode } from "../../spectacle/SpectacleContext"
import useInteractable from "../../interactable/useInteractable"

interface SceneCarouselItemProps {
  index: number
  sceneId: SceneId
}

const SceneCarouselItem: React.FC<SceneCarouselItemProps> = ({
  index,
  sceneId,
}) => {
  const ref = useRef()
  const {
    presentationStore,
    activeSceneId,
    sceneManager,
    viewMode,
    setViewMode,
  } = useSpectacle()
  const { width, height } = presentationStore.meta.viewport
  const isActive = useMemo(() => activeSceneId === sceneId, [
    activeSceneId,
    sceneId,
  ])

  const activateScene = useCallback(() => {
    console.debug("setActive", sceneId)
    if (!isActive) {
      sceneManager.setActiveScene(sceneId)
    } else if (viewMode === ViewMode.SceneOverview) {
      setViewMode(ViewMode.Desk)
    }
  }, [isActive, sceneId, sceneManager, setViewMode, viewMode])

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
