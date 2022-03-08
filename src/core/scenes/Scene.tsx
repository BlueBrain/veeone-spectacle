import { Desk } from "../desk"
import React from "react"
import DeskContextProvider from "../desk/DeskContextProvider"
import { SceneId } from "../types"

interface SceneProps {
  sceneId: SceneId
}

const Scene: React.FC<SceneProps> = ({ sceneId }) => {
  return (
    <DeskContextProvider sceneId={sceneId}>
      <Desk />
    </DeskContextProvider>
  )
}

export default Scene
