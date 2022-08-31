import { useCallback, useEffect, useMemo, useState } from "react"
import { SpectaclePresentation } from "../../types"
import {
  SpectacleWorkerMethod,
  UpdateStoreParams,
  WorkerToSpectacleMethod,
} from "../workers/methods"

interface UsePresentationRestorerProps {
  freshPresentation: SpectaclePresentation
}

const usePresentationStateManager = ({
  freshPresentation,
}: UsePresentationRestorerProps) => {
  // The presentationStore holds the global state of the application like
  // frames, scenes etc. This object is saved to store and reload presentation.
  const [
    presentationStore,
    setPresentationStore,
  ] = useState<SpectaclePresentation>(freshPresentation)

  const [hasBeenMutated, setHasBeenMutated] = useState(false)

  const markMutatedState = useCallback(() => {
    setHasBeenMutated(true)
  }, [])

  const markCleanState = useCallback(() => {
    setHasBeenMutated(false)
  }, [])

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

  const worker = useMemo(() => {
    console.info("Creating new worker for Spectacle state...")
    return new Worker(
      // @ts-ignore
      new URL("../workers/state-reloader-worker", import.meta.url)
    )
  }, [])

  const handleIncomingWorkerMessage = useCallback((message: MessageEvent) => {
    switch (message.data.method) {
      case WorkerToSpectacleMethod.ReceiveLatestStore: {
        console.log(
          "Received latest store.. restoring....",
          message.data.params
        )
        if (message.data.params.presentationStore) {
          loadPresentationStore(message.data.params.presentationStore)
        }
        break
      }
      default: {
        console.warn("Unhandled message", message)
      }
    }
  }, [])

  useEffect(() => {
    worker.addEventListener("message", handleIncomingWorkerMessage)
  }, [worker, handleIncomingWorkerMessage])

  const restoreLatestPresentationStore = useCallback(() => {
    worker.postMessage({
      method: SpectacleWorkerMethod.GetLatestStore,
    })
  }, [handleIncomingWorkerMessage])

  useEffect(() => {
    restoreLatestPresentationStore()
  }, [])

  useEffect(() => {
    worker.postMessage({
      id: Date.now(),
      method: SpectacleWorkerMethod.UpdateStore,
      params: {
        timestamp: Date.now(),
        presentationStore,
      } as UpdateStoreParams,
    })
  }, [presentationStore])

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

  return {
    loadPresentationStore,
    savePresentationStore,
    presentationStore,
    setPresentationStore,
    markMutatedState,
    markCleanState,
    isPresentationClean,
  }
}

export default usePresentationStateManager
