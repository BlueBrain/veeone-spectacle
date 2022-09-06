import { SceneId } from "../types"

export interface AddScenePayload {
  sceneId: SceneId
}

export interface SetActiveScenePayload {
  sceneId: SceneId
}

export interface RemoveScenePayload {
  sceneId: SceneId
}

export interface MoveScenePayload {
  sceneId: SceneId
}
