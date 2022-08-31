import { Dispatch, SetStateAction, useCallback } from "react"
import { FramesRegister, FrameStack, SpectaclePresentation } from "../../types"
import {
  AddFramePayload,
  BringFrameToFrontPayload,
  CloseFramePayload,
  ManipulateFramePayload,
  SendFrameToBackPayload,
  UpdateFrameDataPayload,
} from "../types"

interface UseFrameManagerProps {
  setPresentationStore: Dispatch<SetStateAction<SpectaclePresentation>>
  markMutatedState: () => void
}

const useFrameManager = ({
  setPresentationStore,
  markMutatedState,
}: UseFrameManagerProps) => {
  const updateFrameState = useCallback(
    (
      getFramesObject:
        | ((currentFrames: FramesRegister) => FramesRegister)
        | null,
      getFrameStackObject: ((state) => FrameStack) | null
    ) => {
      setPresentationStore((currentState: SpectaclePresentation) => {
        const activeSceneId = currentState.scenes.activeScene
        const frames = currentState.scenes.scenes[activeSceneId].frames
        const frameStack = currentState.scenes.scenes[activeSceneId].frameStack

        return {
          ...currentState,
          scenes: {
            ...currentState.scenes,
            scenes: {
              ...currentState.scenes.scenes,
              [activeSceneId]: {
                frames: getFramesObject ? getFramesObject(frames) : frames,
                frameStack: getFrameStackObject
                  ? getFrameStackObject(frameStack)
                  : frameStack,
              },
            },
          },
        }
      })
    },
    []
  )

  const updateFrames = useCallback(
    (getFramesObject: (frames: FramesRegister) => FramesRegister) => {
      updateFrameState(getFramesObject, null)
    },
    [updateFrameState]
  )

  const updateFrameStack = useCallback(
    (getFrameStackObject: (frameStack) => FrameStack) => {
      updateFrameState(null, getFrameStackObject)
    },
    [updateFrameState]
  )

  const addFrame = useCallback(
    (payload: AddFramePayload) => {
      const { width, height } = payload.size
      const left = payload.position.left - width / 2
      const top = payload.position.top - height / 2
      updateFrameState(
        frames => ({
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
        }),
        frameStack => [...frameStack, payload.frameId]
      )
      markMutatedState()
    },
    [markMutatedState, updateFrameState]
  )

  const manipulateFrame = useCallback(
    (payload: ManipulateFramePayload) => {
      updateFrames(frames => {
        if (!frames[payload.frameId]) {
          return frames
        }
        const newSituation = {
          ...frames[payload.frameId].situation,
          ...payload.situationUpdate,
        }
        return {
          ...frames,
          [payload.frameId]: {
            ...frames[payload.frameId],
            situation: { ...newSituation },
          },
        }
      })
      markMutatedState()
    },
    [markMutatedState, updateFrames]
  )

  const updateFrameData = useCallback(
    (payload: UpdateFrameDataPayload) => {
      updateFrames(frames => ({
        ...frames,
        [payload.frameId]: {
          ...frames[payload.frameId],
          data: {
            ...frames[payload.frameId].data,
            ...payload.data,
          },
        },
      }))
      markMutatedState()
    },
    [markMutatedState, updateFrames]
  )

  const closeFrame = useCallback(
    (payload: CloseFramePayload) => {
      updateFrameState(
        frames => {
          const { [payload.frameId]: value, ...newFrames } = frames
          return newFrames
        },
        frameStack => [...frameStack.filter(id => id !== payload.frameId)]
      )
      markMutatedState()
    },
    [markMutatedState, updateFrameState]
  )

  const closeAllFrames = useCallback(() => {
    updateFrameState(
      frames => ({}),
      frameStack => []
    )
    markMutatedState()
  }, [markMutatedState, updateFrameState])

  const bringFrameToFront = useCallback(
    (payload: BringFrameToFrontPayload) => {
      updateFrameStack(frameStack =>
        frameStack.includes(payload.frameId)
          ? [
              ...frameStack.filter(
                value => value !== payload.frameId && value !== null
              ),
              payload.frameId,
            ]
          : frameStack
      )
      markMutatedState()
    },
    [markMutatedState, updateFrameStack]
  )

  const sendFrameToBack = useCallback(
    (payload: SendFrameToBackPayload) => {
      updateFrameStack(frameStack => [
        payload.frameId,
        ...frameStack.filter(
          value => value !== payload.frameId && value !== null
        ),
      ])
      markMutatedState()
    },
    [markMutatedState, updateFrameStack]
  )

  const deactivateAllFrames = useCallback(() => {
    updateFrameStack(frameStack => {
      const otherFrames = frameStack.filter(value => value !== null)
      return otherFrames.length > 0 ? [...otherFrames, null] : []
    })
    markMutatedState()
  }, [markMutatedState, updateFrameStack])

  return {
    addFrame,
    manipulateFrame,
    updateFrameData,
    bringFrameToFront,
    sendFrameToBack,
    deactivateAllFrames,
    closeFrame,
    closeAllFrames,
  }
}

export default useFrameManager
