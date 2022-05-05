import { createContext, useContext } from "react"
import { FrameEntry, FrameId, SceneId, SpectacleScene } from "../types"

export interface FullscreenFrame {
  frameId: FrameId
  frame: FrameEntry | null
  extraData: any
}

interface DeskContextProps {
  sceneId: SceneId
  scene: SpectacleScene
  getFrame(frameId: FrameId): FrameEntry
  setFullscreenFrame(fullscreenFrame: FullscreenFrame): void
  fullscreenFrame: FullscreenFrame
}

const DeskContext = createContext<DeskContextProps>(null)

export const useDesk = () => useContext(DeskContext)

export default DeskContext
