import { createContext, useContext } from "react"
import { SceneId, SpectacleScene } from "../types"
import {
  MoveScenePayload,
  RemoveScenePayload,
  SetActiveScenePayload,
} from "./types"

export enum MoveSceneDirection {
  Left = -1,
  Right = 1,
}

export interface SceneContextProps {
  activeScene: SpectacleScene
  activeSceneId: SceneId
  nextSceneId: SceneId
  previousSceneId: SceneId
  activeSceneIndex: number
  sceneIds: SceneId[]
  addNewScene: () => void
  switchToNextScene: () => void
  switchToPreviousScene: () => void
  moveSceneLeft: (payload: MoveScenePayload) => void
  moveSceneRight: (payload: MoveScenePayload) => void
  moveSceneToBeginning: (payload: MoveScenePayload) => void
  moveSceneToEnd: (payload: MoveScenePayload) => void
  removeScene: (payload: RemoveScenePayload) => void
  setActiveScene: (payload: SetActiveScenePayload) => void
  getScene: (sceneId: SceneId) => SpectacleScene
}

const SceneContext = createContext<SceneContextProps>(null)

export const useScenes = () => useContext(SceneContext)

export default SceneContext
