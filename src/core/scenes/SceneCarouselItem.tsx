import React, { useMemo, useRef } from "react"
import Scene from "./Scene"
import { Box } from "@mui/material"
import { SceneId } from "../types"
import { useSpectacle, ViewMode } from "../spectacle/SpectacleContext"

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
    setViewMode,
  } = useSpectacle()
  const { width, height } = presentationStore.meta.viewport
  const isActive = useMemo(() => activeSceneId === sceneId, [
    activeSceneId,
    sceneId,
  ])

  const setActive = () => {
    console.debug("setActive", sceneId)
    if (!isActive) {
      sceneManager.setActiveScene(sceneId)
    } else {
      // open desk mode
      setViewMode(ViewMode.Desk)
    }
  }

  return (
    <Box
      key={index}
      ref={ref}
      onClick={setActive}
      sx={{
        display: "flex",
        flexShrink: 0,
        background: `rgba(0, 255, 0, .3)`,
        position: "relative",
        width: `${width}px`,
        height: `${height}px`,
        transition: `transform ease 1000ms`,
        boxShadow: `0 3rem 4rem rgba(0, 0, 0, .4)`,
        zIndex: isActive ? 100 : 0,
        transform: `
        ${isActive ? `scale(1)` : `scale(0.8)`}
        `,
      }}
    >
      {/*<Box component={"h1"}>{sceneId}</Box>*/}
      <Scene sceneId={sceneId} />
    </Box>
  )
}

export default SceneCarouselItem
