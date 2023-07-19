import React, { RefObject, useCallback, useMemo, useState } from "react"
import DeskContext, { DeskContextProps } from "./DeskContext"
import { FrameId, SceneId } from "../types"
import { useScenes } from "../scenes/SceneContext"

interface DeskContextProviderProps {
  sceneId: SceneId
  deskRef: RefObject<any>
}

const DeskContextProvider: React.FC<DeskContextProviderProps> = ({
  sceneId,
  deskRef,
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
      deskRef,
    }),
    [sceneId, scene, getFrame, fullscreenFrame, deskRef]
  )

  return (
    <DeskContext.Provider value={providerValue}>
      {children}
    </DeskContext.Provider>
  )
}

export default DeskContextProvider
