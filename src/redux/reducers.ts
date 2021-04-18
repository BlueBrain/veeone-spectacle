import { Actions, AddFramePayload, ReduxAction } from "./actions"
import { FramesData, LauncherMenuData, PresentationStateData } from "../presentations/interfaces"
import { generateRandomId } from "../common/random"

const generateFrameId = () => generateRandomId(6)

const framesReducer = (frames: FramesData, action: ReduxAction) => {
  console.debug("Calling framesReducer")
  switch (action.type) {
    case Actions.AddFrame:
      const newFrameId = generateFrameId()
      const addFramePayload = action.payload as AddFramePayload
      const width = 200
      const height = 200
      const left = addFramePayload.position.left - width / 2
      const top = addFramePayload.position.top - height / 2
      return {
        ...frames,
        [newFrameId]: {
          situation: {
            left: left,
            top: top,
            width: width,
            height: height,
            angle: 0,
            scale: 1
          }
        }
      }

    case Actions.CloseFrame:
      const { [action.payload.frameId]: value, ...newFrames } = frames
      return newFrames

    case Actions.ManipulateFrame:
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

    default:
      return frames
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
  launcherMenus: launcherMenuReducer(state.launcherMenus, action),
})
