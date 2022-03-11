import { spectacleStore } from "../redux/store"
import {
  addScene,
  AddScenePayload,
  moveSceneLeft,
  moveSceneRight,
  removeScene,
  setActiveScene,
  switchToNextScene,
  switchToPreviousScene,
} from "../redux/actions"
import { generateRandomId } from "../../common/random"
import { SceneId } from "../types"

class SceneManager {
  public addNewScene() {
    const sceneId = generateRandomId()
    const payload: AddScenePayload = {
      sceneId,
    }
    spectacleStore.dispatch(addScene(payload))
  }

  public switchToNextScene() {
    console.debug("changeToNextScene...")
    spectacleStore.dispatch(switchToNextScene())
  }

  public switchToPreviousScene() {
    spectacleStore.dispatch(switchToPreviousScene())
  }

  public setActiveScene(sceneId: SceneId) {
    spectacleStore.dispatch(setActiveScene(sceneId))
  }

  public moveSceneRight(sceneId: SceneId) {
    spectacleStore.dispatch(moveSceneRight(sceneId))
  }

  public moveSceneLeft(sceneId: SceneId) {
    spectacleStore.dispatch(moveSceneLeft(sceneId))
  }

  public removeScene(sceneId: SceneId) {
    spectacleStore.dispatch(removeScene(sceneId))
  }
}

export default SceneManager
