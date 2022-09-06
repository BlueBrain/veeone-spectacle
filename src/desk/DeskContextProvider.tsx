import React, { useCallback, useMemo, useState } from "react"
import DeskContext, { DeskContextProps } from "./DeskContext"
import { FrameId, SceneId } from "../types"
import { useScenes } from "../scenes/SceneContext"

interface DeskContextProviderProps {
  sceneId: SceneId
}

const DeskContextProvider: React.FC<DeskContextProviderProps> = ({
  sceneId,
  children,
}) => {
  const [fullscreenFrame, setFullscreenFrame] = useState(null)

  const { getScene } = useScenes()

  const scene = useMemo(() => getScene(sceneId), [getScene, sceneId])

  const getFrame = useCallback((frameId: FrameId) => scene.frames[frameId], [
    scene,
  ])

  const providerValue: DeskContextProps = useMemo(
    () => ({
      sceneId,
      scene,
      getFrame,
      setFullscreenFrame,
      fullscreenFrame,
    }),
    [sceneId, scene, getFrame, fullscreenFrame]
  )

  return (
    <DeskContext.Provider value={providerValue}>
      {children}
    </DeskContext.Provider>
  )
}

export default DeskContextProvider
