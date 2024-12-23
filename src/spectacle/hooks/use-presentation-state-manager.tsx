import { useCallback, useEffect, useMemo, useState } from "react"
import { SpectaclePresentation } from "../../types"
import {
  InitializeParams,
  SpectacleWorkerMethod,
  UpdateStoreParams,
  WorkerToSpectacleMethod,
} from "../workers/methods"
import { useConfig } from "../../config/AppConfigContext"

interface UsePresentationRestorerProps {
  freshPresentation: SpectaclePresentation
}

const usePresentationStateManager = ({
  freshPresentation,
}: UsePresentationRestorerProps) => {
  const config = useConfig()

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
    const newWorker = new Worker(
      new URL(
        `../workers/state-reloader-worker`,
        // @ts-ignore
        import.meta.url
      )
    )

    newWorker.postMessage({
      method: SpectacleWorkerMethod.Initialize,
      params: {
        storeStateKeepMaxCount: config.STORE_STATE_KEEP_MAX_COUNT,
        infiniteReloadProtectionPeriodSeconds:
          config.INFINITE_RELOAD_PROTECTION_PERIOD_SECONDS,
        infiniteReloadProtectionMaxAttempts:
          config.INFINITE_RELOAD_PROTECTION_MAX_ATTEMPTS,
        dbName: config.STATE_STORE_INDEXEDDB_NAME,
      } as InitializeParams,
    })

    return newWorker
  }, [config])

  const handleIncomingWorkerMessage = useCallback((message: MessageEvent) => {
    switch (message.data.method) {
      case WorkerToSpectacleMethod.ProvideLatestStore: {
        if (message.data.params.presentationStore) {
          loadPresentationStore(message.data.params.presentationStore)
        }
        break
      }
      default: {
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
  }, [])

  useEffect(() => {
    restoreLatestPresentationStore()
  }, [])

  useEffect(() => {
    if (presentationStore !== freshPresentation || hasBeenMutated) {
      worker.postMessage({
        method: SpectacleWorkerMethod.UpdateStore,
        params: {
          timestamp: Date.now(),
          presentationStore,
        } as UpdateStoreParams,
      })
    }
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
