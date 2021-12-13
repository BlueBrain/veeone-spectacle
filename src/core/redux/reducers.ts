import { Actions, AddFramePayload, UpdateFrameDataPayload } from "./actions"
import { FramesRegister, FrameStack } from "../types"
import { ReduxAction } from "../../redux/actions"

export const framesReducer = (frames: FramesRegister, action: ReduxAction) => {
  switch (action.type) {
    case Actions.AddFrame: {
      const payload = action.payload as AddFramePayload
      const width = payload.size ? payload.size.width : 400
      const height = payload.size ? payload.size.height : 400
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

    case Actions.LoadScene: {
      return action.payload.state.frames
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
      return [...frameStack.filter(id => id !== frameId), frameId]
    }
    case Actions.SendFrameToBack: {
      const frameId = action.payload.frameId
      return [frameId, ...frameStack.filter(id => id !== frameId)]
    }
    case Actions.LoadScene: {
      return action.payload.state.frameStack
    }
    default:
      return frameStack
  }
}
