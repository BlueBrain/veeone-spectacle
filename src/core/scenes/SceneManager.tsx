import { spectacleStore } from "../redux/store"
import {
  addScene,
  AddScenePayload,
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
}

export default SceneManager
