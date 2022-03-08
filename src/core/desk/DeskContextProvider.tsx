import React, { useCallback, useMemo } from "react"
import DeskContext from "./DeskContext"
import { SceneId, SpectaclePresentation, SpectacleScene } from "../types"
import { useSelector } from "react-redux"
import { getScene } from "../redux/selectors"

interface DeskContextProviderProps {
  sceneId: SceneId
}

const DeskContextProvider: React.FC<DeskContextProviderProps> = ({
  sceneId,
  children,
}) => {
  const scene = (useSelector<SpectaclePresentation>(state =>
    getScene(state, sceneId)
  ) as unknown) as SpectacleScene

  const getFrame = useCallback(
    frameId => {
      return scene.frames[frameId]
    },
    [scene.frames]
  )

  const providerValue = useMemo(
    () => ({
      sceneId,
      scene,
      getFrame,
    }),
    [sceneId, scene, getFrame]
  )

  return (
    <DeskContext.Provider value={providerValue}>
      {children}
    </DeskContext.Provider>
  )
}

export default DeskContextProvider
