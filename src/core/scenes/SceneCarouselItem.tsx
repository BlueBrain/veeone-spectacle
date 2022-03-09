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
      setViewMode(ViewMode.Desk)
    }
  }

  return (
    <Box
      key={index}
      ref={ref}
      onClick={setActive}
      sx={{
        flexShrink: 0,
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
      <Scene sceneId={sceneId} />
      {/*<Box*/}
      {/*  sx={{*/}
      {/*    transform: `translate(0, -100%)`,*/}
      {/*    paddingBottom: "3rem",*/}
      {/*    fontSize: "3rem",*/}
      {/*    fontWeight: 300,*/}
      {/*    textAlign: "center",*/}
      {/*    color: `rgba(255, 255, 255, .3)`,*/}
      {/*  }}*/}
      {/*>*/}
      {/*  Scene {index + 1}*/}
      {/*</Box>*/}
    </Box>
  )
}

export default SceneCarouselItem
