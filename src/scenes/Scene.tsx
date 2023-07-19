import { Desk } from "../desk"
import React, { useRef } from "react"
import DeskContextProvider from "../desk/DeskContextProvider"
import { SceneId } from "../types"

interface SceneProps {
  sceneId: SceneId
}

const Scene: React.FC<SceneProps> = ({ sceneId }) => {
  const deskRef = useRef()

  return (
    <DeskContextProvider sceneId={sceneId} deskRef={deskRef}>
      <Desk />
    </DeskContextProvider>
  )
}

export default Scene
