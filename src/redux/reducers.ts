import { Actions, ReduxAction } from "./actions"
import { PresentationStateData } from "../presentations/interfaces"

const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
const charactersLength = characters.length
const generateFrameId = (length = 6) => {
  let result = []

  for (let i = 0; i < length; i++) {
    result.push(characters.charAt(Math.floor(Math.random() * charactersLength)))
  }
  return result.join('')
}

export const presentationReducer = (state: PresentationStateData, action: ReduxAction) => {
  console.debug("presentationReducer run", action.type)
  switch (action.type) {
    case Actions.AddFrame:
      const newFrameId = generateFrameId()
      const newState = {
        ...state,
        frames: {
          ...state.frames,
          [newFrameId]: {
            situation: {
              left: 50,
              top: 50,
              width: 200,
              height: 200,
              angle: 0,
              scale: 1
            },
          }
        }
      }
      console.debug("Returning after AddFrame state", newState)
      return newState

    case Actions.SetFrameSituation:
      console.debug("SetFrameSituation")
      return {
        ...state,
        frames: {
          ...state.frames,
          [action.payload.frameId]: {
            ...state.frames[action.payload.frameId],
            situation: action.payload.situation
          }
        }
      }
    case Actions.CloseFrame:
      console.debug("Actions.CloseFrame")
      const {[action.payload.frameId]: value, ...frames} = state.frames
      return {
        ...state,
        frames: frames
      }
    default:
      return state
  }
}
