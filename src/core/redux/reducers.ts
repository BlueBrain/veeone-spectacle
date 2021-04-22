import { Actions, AddFramePayload, ReduxAction } from "./actions"
import { FrameId, FramesData, FrameStack, LauncherMenuData, PresentationStateData } from "../presentations/interfaces"
import { generateRandomId } from "../../common/random"



const framesReducer = (frames: FramesData, action: ReduxAction) => {
  console.debug("Calling framesReducer")
  switch (action.type) {
    case Actions.AddFrame: {
      const payload = action.payload as AddFramePayload
      const width = 300
      const height = 200
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
            angle: 0
          }
        }
      }
    }

    case Actions.CloseFrame: {
      const { [action.payload.frameId]: value, ...newFrames } = frames
      return newFrames
    }

    case Actions.ManipulateFrame: {
      const newSituation = {
        ...frames[action.payload.frameId].situation,
        ...action.payload.situationUpdate,
      }
      return {
        ...frames,
        [action.payload.frameId]: {
          ...frames[action.payload.frameId],
          situation: { ...newSituation },
        }
      }
    }

    default:
      return frames
  }
}

const frameStackReducer = (frameStack: FrameStack, action: ReduxAction) => {
  switch(action.type) {
    case Actions.AddFrame: {
      return [...frameStack, (action.payload as AddFramePayload).frameId]
    }
    case Actions.CloseFrame: {
      return [...frameStack.filter(id => id !== action.payload.frameId)]
    }
    case Actions.BringFrameToFront: {
      const frameId = action.payload.frameId
      return [...frameStack.filter(id => id !== frameId), frameId]
    }
    default:
      return frameStack
  }
}

const launcherMenuReducer = (launcherMenus: LauncherMenuData[], action: ReduxAction) => {
  console.debug("Calling launcherMenuReducer")
  switch (action.type) {
    case Actions.OpenLauncherMenu:
      const { left, top } = action.payload.position
      const newLauncherMenu = {
        menuId: generateRandomId(4),
        position: { left, top },
      }
      console.debug("Run Actions.OpenLauncherMenu", newLauncherMenu)
      return [...launcherMenus, newLauncherMenu]

    case Actions.CloseLauncherMenu:
      return launcherMenus.filter((menu) => menu.menuId !== action.payload.menuId)

    default:
      return launcherMenus
  }
}

export const rootReducer = (state: PresentationStateData, action: ReduxAction) => ({
  frames: framesReducer(state.frames, action),
  frameStack: frameStackReducer(state.frameStack, action),
  launcherMenus: launcherMenuReducer(state.launcherMenus, action),
})
