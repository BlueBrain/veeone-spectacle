import { createContext, useContext } from "react"
import { FrameEntry, FrameId, SceneId, SpectacleScene } from "../types"

interface DeskContextProps {
  sceneId: SceneId
  scene: SpectacleScene
  getFrame(frameId: FrameId): FrameEntry
}

const DeskContext = createContext<DeskContextProps>(null)

export const useDesk = () => useContext(DeskContext)

export default DeskContext
