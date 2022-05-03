import { createContext, useContext } from "react"
import { FrameEntry, FrameId, SceneId, SpectacleScene } from "../types"

type FullscreenFrame = FrameEntry | null

interface DeskContextProps {
  sceneId: SceneId
  scene: SpectacleScene
  getFrame(frameId: FrameId): FrameEntry
  setFullscreenFrame(frame: FullscreenFrame): void
  fullscreenFrame: FullscreenFrame
}

const DeskContext = createContext<DeskContextProps>(null)

export const useDesk = () => useContext(DeskContext)

export default DeskContext
