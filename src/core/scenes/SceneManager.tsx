import {
  addScene,
  AddScenePayload,
  moveSceneLeft,
  moveSceneRight,
  moveSceneToBeginning,
  moveSceneToEnd,
  removeScene,
  setActiveScene,
  switchToNextScene,
  switchToPreviousScene,
} from "../redux/actions"
import { generateRandomId } from "../../common/random"
import { SceneId } from "../types"

class SceneManager {
  dispatch: (any) => void
  constructor(dispatch) {
    this.dispatch = dispatch
  }

  public readonly addNewScene = () => {
    const sceneId = generateRandomId()
    const payload: AddScenePayload = {
      sceneId,
    }
    this.dispatch(addScene(payload))
  }

  public readonly switchToNextScene = () => {
    console.debug("changeToNextScene...")
    this.dispatch(switchToNextScene())
  }

  public readonly switchToPreviousScene = () => {
    this.dispatch(switchToPreviousScene())
  }

  public readonly setActiveScene = (sceneId: SceneId) => {
    this.dispatch(setActiveScene(sceneId))
  }

  public readonly moveSceneRight = (sceneId: SceneId) => {
    this.dispatch(moveSceneRight(sceneId))
  }

  public readonly moveSceneLeft = (sceneId: SceneId) => {
    this.dispatch(moveSceneLeft(sceneId))
  }

  public readonly moveSceneToBeginning = (sceneId: SceneId) => {
    this.dispatch(moveSceneToBeginning(sceneId))
  }

  public readonly moveSceneToEnd = (sceneId: SceneId) => {
    this.dispatch(moveSceneToEnd(sceneId))
  }

  public readonly removeScene = (sceneId: SceneId) => {
    this.dispatch(removeScene(sceneId))
  }
}

export default SceneManager
