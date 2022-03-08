import { spectacleStore } from "../redux/store"
import {
  addScene,
  AddScenePayload,
  switchToNextScene,
  switchToPreviousScene,
} from "../redux/actions"
import { generateRandomId } from "../../common/random"

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
}

export default SceneManager
