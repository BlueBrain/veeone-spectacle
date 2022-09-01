import SceneContext, {
  MoveSceneDirection,
  SceneContextProps,
} from "./SceneContext"
import React, { useCallback, useMemo } from "react"
import {
  SceneId,
  SpectaclePresentation,
  SpectacleScene,
  SpectacleScenes,
} from "../types"
import { useSpectacle } from "../spectacle/SpectacleStateContext"
import { generateRandomId } from "../common/random"
import {
  MoveScenePayload,
  RemoveScenePayload,
  SetActiveScenePayload,
} from "./types"

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

const SceneContextProvider: React.FC = ({ children }) => {
  const { presentationStore, updatePresentationStore } = useSpectacle()

  const updateScenes = useCallback(
    (getScenesObject: (currentScenes: SpectacleScenes) => SpectacleScenes) => {
      return updatePresentationStore((state: SpectaclePresentation) => {
        return { ...state, scenes: getScenesObject(state.scenes) }
      })
    },
    [updatePresentationStore]
  )

  const sceneIds: SceneId[] = useMemo(
    () => presentationStore.scenes.sceneOrder,
    [presentationStore.scenes.sceneOrder]
  )

  const activeSceneId: SceneId = useMemo(
    () => presentationStore.scenes.activeScene,
    [presentationStore.scenes.activeScene]
  )

  const activeScene = useMemo(
    () => presentationStore.scenes.scenes[activeSceneId],
    [activeSceneId, presentationStore.scenes.scenes]
  )

  const activeSceneIndex: number = useMemo(
    () => sceneIds.indexOf(activeSceneId),
    [activeSceneId, sceneIds]
  )

  const previousSceneId: SceneId = useMemo(
    () => sceneIds[activeSceneIndex > 0 ? activeSceneIndex - 1 : null],
    [activeSceneIndex, sceneIds]
  )

  const nextSceneId: SceneId = useMemo(
    () =>
      sceneIds[
        activeSceneIndex + 1 < sceneIds.length ? activeSceneIndex + 1 : null
      ],
    [activeSceneIndex, sceneIds]
  )

  const addNewScene = useCallback(() => {
    updateScenes((scenes: SpectacleScenes) => {
      const newSceneId = generateRandomId()
      const newScene: SpectacleScene = { frames: {}, frameStack: [] }
      console.debug("Add new scene....")
      return {
        ...scenes,
        sceneOrder: [...scenes.sceneOrder, newSceneId],
        scenes: { ...scenes.scenes, [newSceneId]: newScene },
      }
    })
  }, [updateScenes])

  const switchToNextScene = useCallback(() => {
    updateScenes(scenes => {
      const currentActiveScene = scenes.activeScene
      const currentActiveSceneIndex = scenes.sceneOrder.indexOf(
        currentActiveScene
      )
      const newActiveSceneIndex =
        currentActiveSceneIndex + 1 < scenes.sceneOrder.length
          ? currentActiveSceneIndex + 1
          : currentActiveSceneIndex
      const newActiveScene = scenes.sceneOrder[newActiveSceneIndex]
      return { ...scenes, activeScene: newActiveScene }
    })
  }, [updateScenes])

  const switchToPreviousScene = useCallback(() => {
    updateScenes(scenes => {
      const currentActiveScene = scenes.activeScene
      const currentActiveSceneIndex = scenes.sceneOrder.indexOf(
        currentActiveScene
      )
      const newActiveSceneIndex =
        currentActiveSceneIndex > 0 ? currentActiveSceneIndex - 1 : 0
      const newActiveScene = scenes.sceneOrder[newActiveSceneIndex]
      return { ...scenes, activeScene: newActiveScene }
    })
  }, [updateScenes])

  const moveSceneLeft = useCallback(
    (payload: MoveScenePayload) => {
      updateScenes(scenes => {
        const newSceneOrder = getNewSceneOrder(
          scenes.sceneOrder,
          payload.sceneId,
          MoveSceneDirection.Left
        )
        return { ...scenes, sceneOrder: newSceneOrder }
      })
    },
    [updateScenes]
  )

  const moveSceneRight = useCallback(
    (payload: MoveScenePayload) => {
      updateScenes(scenes => {
        const newSceneOrder = getNewSceneOrder(
          scenes.sceneOrder,
          payload.sceneId,
          MoveSceneDirection.Right
        )
        return { ...scenes, sceneOrder: newSceneOrder }
      })
    },
    [updateScenes]
  )

  const moveSceneToBeginning = useCallback(
    (payload: MoveScenePayload) => {
      updateScenes(scenes => {
        const newSceneOrder = scenes.sceneOrder.filter(
          id => id !== payload.sceneId
        )
        newSceneOrder.unshift(payload.sceneId)
        return { ...scenes, sceneOrder: newSceneOrder }
      })
    },
    [updateScenes]
  )

  const moveSceneToEnd = useCallback(
    (payload: MoveScenePayload) => {
      updateScenes(scenes => {
        const newSceneOrder = [
          ...scenes.sceneOrder.filter(id => id !== payload.sceneId),
          payload.sceneId,
        ]
        return { ...scenes, sceneOrder: newSceneOrder }
      })
    },
    [updateScenes]
  )

  const removeScene = useCallback(
    (payload: RemoveScenePayload) => {
      updateScenes(scenes => {
        console.error("remove scene...")
        const newScenes = { ...scenes.scenes }
        const deletedSceneIndex = scenes.sceneOrder.indexOf(payload.sceneId)
        delete newScenes[payload.sceneId]
        const newSceneOrder = scenes.sceneOrder.filter(
          value => value !== payload.sceneId
        )
        const newActiveSceneIndex =
          deletedSceneIndex > 0 ? deletedSceneIndex - 1 : 0
        const newActiveScene = newSceneOrder[newActiveSceneIndex]
        return {
          ...scenes,
          scenes: newScenes,
          activeScene: newActiveScene,
          sceneOrder: newSceneOrder,
        }
      })
    },
    [updateScenes]
  )

  const setActiveScene = useCallback(
    (payload: SetActiveScenePayload) => {
      updateScenes(scenes => ({ ...scenes, activeScene: payload.sceneId }))
    },
    [updateScenes]
  )

  const getScene = useCallback(
    (sceneId: SceneId) => {
      return presentationStore.scenes.scenes[sceneId]
    },
    [presentationStore.scenes.scenes]
  )

  const providerValue: SceneContextProps = useMemo(
    () => ({
      activeScene,
      getScene,
      sceneIds,
      activeSceneId,
      activeSceneIndex,
      previousSceneId,
      nextSceneId,
      addNewScene,
      switchToNextScene,
      switchToPreviousScene,
      moveSceneLeft,
      moveSceneRight,
      moveSceneToBeginning,
      moveSceneToEnd,
      removeScene,
      setActiveScene,
    }),
    [
      activeScene,
      activeSceneId,
      activeSceneIndex,
      addNewScene,
      moveSceneLeft,
      moveSceneRight,
      moveSceneToBeginning,
      moveSceneToEnd,
      nextSceneId,
      previousSceneId,
      removeScene,
      sceneIds,
      setActiveScene,
      switchToNextScene,
      switchToPreviousScene,
    ]
  )

  return (
    <SceneContext.Provider value={providerValue}>
      {children}
    </SceneContext.Provider>
  )
}

export default SceneContextProvider
