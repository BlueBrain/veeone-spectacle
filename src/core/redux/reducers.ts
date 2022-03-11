import {
  Actions,
  AddFramePayload,
  AddScenePayload,
  MoveScenePayload,
  RemoveScenePayload,
  SetScenePayload,
  UpdateFrameDataPayload,
} from "./actions"
import {
  FramesRegister,
  FrameStack,
  SceneId,
  SpectaclePresentation,
  SpectacleScene,
} from "../types"
import { ReduxAction } from "../../redux/actions"
import { config } from "../../config"

enum MoveSceneDirection {
  Left = -1,
  Right = 1,
}

function getNewSceneOrder(
  sceneOrder: SceneId[],
  sceneId: SceneId,
  direction: MoveSceneDirection
) {
  const newSceneOrder = [...sceneOrder]
  const sceneIndex = sceneOrder.indexOf(sceneId)
  let targetIndex = sceneIndex + direction
  if (targetIndex < 0) {
    targetIndex = 0
  } else if (targetIndex >= sceneOrder.length) {
    targetIndex = sceneOrder.length - 1
  }
  newSceneOrder[sceneIndex] = newSceneOrder[targetIndex]
  newSceneOrder[targetIndex] = sceneId
  return newSceneOrder
}

export const scenesReducer = (
  state: SpectaclePresentation,
  action: ReduxAction
) => {
  switch (action.type) {
    case Actions.AddScene: {
      const { sceneId } = action.payload as AddScenePayload
      const newScene: SpectacleScene = { frames: {}, frameStack: [] }
      console.debug("Add new scene....")
      return {
        ...state.scenes,
        sceneOrder: [...state.scenes.sceneOrder, sceneId],
        scenes: { ...state.scenes.scenes, [sceneId]: newScene },
      }
    }

    case Actions.SwitchToNextScene: {
      const currentActiveScene = state.scenes.activeScene
      const currentActiveSceneIndex = state.scenes.sceneOrder.indexOf(
        currentActiveScene
      )
      const newActiveSceneIndex =
        currentActiveSceneIndex + 1 < state.scenes.sceneOrder.length
          ? currentActiveSceneIndex + 1
          : currentActiveSceneIndex
      const newActiveScene = state.scenes.sceneOrder[newActiveSceneIndex]
      return { ...state.scenes, activeScene: newActiveScene }
    }

    case Actions.SwitchToPreviousScene: {
      const currentActiveScene = state.scenes.activeScene
      const currentActiveSceneIndex = state.scenes.sceneOrder.indexOf(
        currentActiveScene
      )
      const newActiveSceneIndex =
        currentActiveSceneIndex > 0 ? currentActiveSceneIndex - 1 : 0
      const newActiveScene = state.scenes.sceneOrder[newActiveSceneIndex]
      return { ...state.scenes, activeScene: newActiveScene }
    }

    case Actions.SetActiveScene: {
      const { sceneId } = action.payload as SetScenePayload
      return { ...state.scenes, activeScene: sceneId }
    }

    case Actions.RemoveScene: {
      const { sceneId } = action.payload as RemoveScenePayload
      console.error("remove scene...")
      const newScenes = { ...state.scenes.scenes }
      delete newScenes[sceneId]
      const newSceneOrder = state.scenes.sceneOrder.filter(
        value => value !== sceneId
      )
      const newActiveScene = newSceneOrder[0]
      return {
        ...state.scenes,
        scenes: newScenes,
        activeScene: newActiveScene,
        sceneOrder: newSceneOrder,
      }
    }

    case Actions.MoveSceneLeft: {
      const { sceneId } = action.payload as MoveScenePayload
      const newSceneOrder = getNewSceneOrder(
        state.scenes.sceneOrder,
        sceneId,
        MoveSceneDirection.Left
      )
      return { ...state.scenes, sceneOrder: newSceneOrder }
    }

    case Actions.MoveSceneRight: {
      const { sceneId } = action.payload as MoveScenePayload
      const newSceneOrder = getNewSceneOrder(
        state.scenes.sceneOrder,
        sceneId,
        MoveSceneDirection.Right
      )
      return { ...state.scenes, sceneOrder: newSceneOrder }
    }

    default: {
      const activeSceneKey = state.scenes.activeScene
      const activeScene = state.scenes.scenes[activeSceneKey]
      return {
        ...state.scenes,
        scenes: {
          ...state.scenes.scenes,
          [activeSceneKey]: {
            frames: framesReducer(activeScene.frames, action),
            frameStack: frameStackReducer(activeScene.frameStack, action),
          },
        },
      }
    }
  }
}

export const framesReducer = (frames: FramesRegister, action: ReduxAction) => {
  switch (action.type) {
    case Actions.AddFrame: {
      const payload = action.payload as AddFramePayload
      const width = payload.size
        ? payload.size.width
        : config.DEFAULT_NEW_FRAME_WIDTH
      const height = payload.size
        ? payload.size.height
        : config.DEFAULT_NEW_FRAME_HEIGHT
      const left = payload.position.left - width / 2
      const top = payload.position.top - height / 2
      return {
        ...frames,
        [payload.frameId]: {
          type: payload.type,
          situation: {
            left: left,
            top: top,
            width: width,
            height: height,
            angle: 0,
          },
          data: payload.contentData,
        },
      }
    }

    case Actions.CloseFrame: {
      const { [action.payload.frameId]: value, ...newFrames } = frames
      return newFrames
    }

    case Actions.CloseAllFrames: {
      return {}
    }

    case Actions.ManipulateFrame: {
      if (!frames[action.payload.frameId]) {
        return frames
      }
      const newSituation = {
        ...frames[action.payload.frameId].situation,
        ...action.payload.situationUpdate,
      }
      return {
        ...frames,
        [action.payload.frameId]: {
          ...frames[action.payload.frameId],
          situation: { ...newSituation },
        },
      }
    }

    case Actions.UpdateFrameData: {
      const { frameId, data } = action.payload as UpdateFrameDataPayload
      return {
        ...frames,
        [frameId]: {
          ...frames[frameId],
          data: {
            ...frames[frameId].data,
            ...data,
          },
        },
      }
    }

    default: {
      return frames
    }
  }
}

export const frameStackReducer = (
  frameStack: FrameStack,
  action: ReduxAction
) => {
  switch (action.type) {
    case Actions.AddFrame: {
      return [...frameStack, (action.payload as AddFramePayload).frameId]
    }
    case Actions.CloseFrame: {
      return [...frameStack.filter(id => id !== action.payload.frameId)]
    }
    case Actions.CloseAllFrames: {
      return []
    }
    case Actions.BringFrameToFront: {
      const frameId = action.payload.frameId
      return frameStack.includes(frameId)
        ? [...frameStack.filter(id => id !== frameId), frameId]
        : frameStack
    }
    case Actions.SendFrameToBack: {
      const frameId = action.payload.frameId
      return [frameId, ...frameStack.filter(id => id !== frameId)]
    }
    default:
      return frameStack
  }
}
