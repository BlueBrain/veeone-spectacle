import { Actions, ReduxAction } from "./actions"
import { FramesData, PresentationStateData } from "../presentations/interfaces"

const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
const charactersLength = characters.length
const generateFrameId = (length = 6) => {
  let result = []

  for (let i = 0; i < length; i++) {
    result.push(characters.charAt(Math.floor(Math.random() * charactersLength)))
  }
  return result.join('')
}

export const framesReducer = (frames: FramesData, action: ReduxAction) => {
  switch (action.type) {
    case Actions.AddFrame:
      const newFrameId = generateFrameId()
      const newState = {
        ...frames,
        [newFrameId]: {
          situation: {
            left: 50,
            top: 50,
            width: 200,
            height: 200,
            angle: 0,
            scale: 1
          }
        }
      }
      return newState

    case Actions.CloseFrame:
      const { [action.payload.frameId]: value, ...newFrames } = frames
      return newFrames

    case Actions.ManipulateFrame:
      const newSituation = {
        ...frames[action.payload.frameId].situation,
        ...action.payload.situationUpdate,
      }
      const manipulatedFrames = {
        ...frames,
        [action.payload.frameId]: {
          ...frames[action.payload.frameId],
          situation: { ...newSituation },
        }
      }
      return manipulatedFrames

    default:
      return frames
  }
}

export const rootReducer = (state: PresentationStateData, action: ReduxAction) => ({
  frames: framesReducer(state.frames, action),
})
