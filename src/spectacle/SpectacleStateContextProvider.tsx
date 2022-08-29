import React, { useCallback, useEffect, useMemo, useState } from "react"
import SpectacleStateContext, {
  SpectacleStateContextProps,
  ThumbnailRegistryItem,
  ViewMode,
} from "./SpectacleStateContext"
import { FramesRegister, FrameStack, SpectaclePresentation } from "../types"
import { useConfig } from "../config/AppConfigContext"
import VeeDriveService from "../veedrive"
import useStatusUpdate from "../synec/use-status-update"
import {
  AddFramePayload,
  BringFrameToFrontPayload,
  CloseFramePayload,
  ManipulateFramePayload,
  ResizePresentationPayload,
  SendFrameToBackPayload,
  UpdateFrameDataPayload,
} from "./types"
import { getFreshPresentation } from "../presentations/fresh-presentation"
import { resizePresentationStore } from "../presentations/resizing"

interface SpectacleContextProviderProps {}

const SpectacleStateContextProvider: React.FC<SpectacleContextProviderProps> = ({
  children,
}) => {
  const config = useConfig()
  const veeDriveService = useMemo(
    () => new VeeDriveService(config.VEEDRIVE_WS_PATH),
    [config]
  )

  const [hasBeenMutated, setHasBeenMutated] = useState(false)

  const [thumbnailRegistry, setThumbnailRegistry] = useState<{
    [key: string]: ThumbnailRegistryItem
  }>({})

  useEffect(() => {
    async function connectToVeeDrive() {
      console.debug("Connecting to VeeDrive...")
      await veeDriveService.connect()
      console.info("VeeDrive connected.")
    }
    void connectToVeeDrive()
  }, [veeDriveService])

  const [viewMode, setViewMode] = useState(
    // ViewMode.SceneOverview
    ViewMode.Desk
  )

  const freshPresentation = useMemo(() => getFreshPresentation({ config }), [])

  const [
    presentationStore,
    setPresentationStore,
  ] = useState<SpectaclePresentation>(freshPresentation)

  const addThumbnailToRegistry = useCallback(
    (path: string, thumbnail: ThumbnailRegistryItem) => {
      console.debug("addThumbnailToRegistry called", path, thumbnail)
      setThumbnailRegistry(oldState => ({
        [path]: thumbnail,
        ...oldState,
      }))
    },
    []
  )

  const markMutatedState = useCallback(() => {
    setHasBeenMutated(true)
  }, [])

  const markCleanState = useCallback(() => {
    setHasBeenMutated(false)
  }, [])

  const updateFrameState = useCallback(
    (
      getFramesObject:
        | ((currentFrames: FramesRegister) => FramesRegister)
        | null,
      getFrameStackObject: ((state) => FrameStack) | null
    ) => {
      setPresentationStore(currentState => {
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

  const loadPresentationStore = useCallback(
    (newStore: SpectaclePresentation) => {
      setPresentationStore({ ...newStore })
      markCleanState()
    },
    [markCleanState]
  )

  const savePresentationStore = useCallback(
    (newStore: SpectaclePresentation) => {
      setPresentationStore({ ...newStore })
      markCleanState()
    },
    [markCleanState]
  )

  const resizePresentation = useCallback(
    (payload: ResizePresentationPayload) => {
      setPresentationStore(state => {
        return resizePresentationStore(
          state,
          payload.newSize,
          config.MINIMUM_FRAME_LONG_SIDE,
          config.MAXIMUM_FRAME_LONG_SIDE,
          {
            width: config.FILE_BROWSER_WIDTH,
            height: config.FILE_BROWSER_HEIGHT,
          }
        )
      })
      markMutatedState()
    },
    [
      config.FILE_BROWSER_HEIGHT,
      config.FILE_BROWSER_WIDTH,
      config.MAXIMUM_FRAME_LONG_SIDE,
      config.MINIMUM_FRAME_LONG_SIDE,
      markMutatedState,
    ]
  )

  const updatePresentationStore = useCallback(callback => {
    setPresentationStore(state => callback(state))
  }, [])

  const isPresentationClean = useMemo(() => {
    // Ignore empty presentation as if they were not modified
    return (
      (presentationStore.savedAt === null &&
        presentationStore.scenes.sceneOrder.length === 1 &&
        presentationStore.scenes.scenes[presentationStore.scenes.activeScene]
          .frameStack.length === 0) ||
      (presentationStore.savedAt === presentationStore.updatedAt &&
        !hasBeenMutated)
    )
  }, [
    hasBeenMutated,
    presentationStore.savedAt,
    presentationStore.scenes.activeScene,
    presentationStore.scenes.sceneOrder.length,
    presentationStore.scenes.scenes,
    presentationStore.updatedAt,
  ])

  const providerValue: SpectacleStateContextProps = useMemo<SpectacleStateContextProps>(
    () => ({
      isPresentationClean,
      veeDriveService,
      viewMode,
      setViewMode,
      presentationStore,
      updatePresentationStore,
      thumbnailRegistry,
      addThumbnailToRegistry,
      addFrame,
      manipulateFrame,
      updateFrameData,
      bringFrameToFront,
      sendFrameToBack,
      deactivateAllFrames,
      closeFrame,
      loadPresentationStore,
      savePresentationStore,
      resizePresentation,
      closeAllFrames,
    }),
    [
      isPresentationClean,
      veeDriveService,
      viewMode,
      presentationStore,
      updatePresentationStore,
      thumbnailRegistry,
      addThumbnailToRegistry,
      addFrame,
      manipulateFrame,
      updateFrameData,
      bringFrameToFront,
      sendFrameToBack,
      deactivateAllFrames,
      closeFrame,
      loadPresentationStore,
      savePresentationStore,
      resizePresentation,
      closeAllFrames,
    ]
  )

  useStatusUpdate(config, veeDriveService)

  return (
    <SpectacleStateContext.Provider value={providerValue}>
      {children}
    </SpectacleStateContext.Provider>
  )
}

export default SpectacleStateContextProvider
