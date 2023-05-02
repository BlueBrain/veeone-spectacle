import React, {
  createContext,
  ReactNode,
  useCallback,
  useMemo,
  useState,
} from "react"
import { Size } from "../../common/types"
import { RunningEnvironment } from "../../config/types"
import ENVIRONMENT_CONFIGS, {
  EnvironmentConfig,
} from "../../config/environmentConfigs"
import { resizePresentationStore } from "../../presentations/resizing"
import { useConfig } from "../../config/AppConfigContext"
import { useSpectacle } from "../SpectacleStateContext"

interface SpectacleUserInterfaceContextProviderProps {
  children: ReactNode
}

interface SpectacleUserInterfaceContextProps {
  workspaceSize: Size
  setWorkspaceSize(newSize: Size): void
  isLive: boolean
  setIsLive(newValue: boolean): void
  isGridVisible: boolean
  setIsGridVisible(newValue: boolean): void
  zoomIn(): void
  zoomOut(): void
  zoomFit(): void
  targetEnvironmentConfig: EnvironmentConfig
  activateEnvironment(newValue: RunningEnvironment): void
}

const SpectacleUserInterfaceContext = createContext<SpectacleUserInterfaceContextProps>(
  {
    workspaceSize: { width: 0, height: 0 },
    setWorkspaceSize() {
      throw new Error("Not implemented")
    },
    isLive: false,
    setIsLive() {
      throw new Error("Not implemented")
    },
    isGridVisible: false,
    setIsGridVisible() {
      throw new Error("Not implemented")
    },
    zoomIn() {
      throw new Error("Not implemented")
    },
    zoomOut() {
      throw new Error("Not implemented")
    },
    zoomFit() {
      throw new Error("Not implemented")
    },
    activateEnvironment() {
      throw new Error("Not implemented")
    },
    targetEnvironmentConfig: {
      code: RunningEnvironment.DEV,
      title: "Development Environment",
      shortTitle: "Dev",
      pxWidth: 1000,
      pxHeight: 600,
      aspectRatio: "auto",
      placeUrl: "",
      place: "",
      active: true,
      gridCols: 1,
      gridRows: 1,
    },
  }
)

export const useSpectacleUserInterface = () =>
  React.useContext(SpectacleUserInterfaceContext)

const SpectacleUserInterfaceContextProvider: React.FC<SpectacleUserInterfaceContextProviderProps> = ({
  children,
}) => {
  const config = useConfig()

  const {
    presentationStore,
    loadPresentationStore,
    viewZoomPercent,
    setViewZoomPercent,
  } = useSpectacle()

  const [workspaceSize, setWorkspaceSize] = useState<Size>({
    width: 0,
    height: 0,
  })

  const [isLive, setIsLive] = useState(false)

  const [isGridVisible, setIsGridVisible] = useState(true)

  const targetEnvironmentConfig = useMemo(() => {
    return {
      ...ENVIRONMENT_CONFIGS[presentationStore.targetEnvironment],
    }
  }, [presentationStore.targetEnvironment])

  const activateEnvironment = useCallback(
    (newEnvironmentCode: RunningEnvironment) => {
      const targetConfig = { ...ENVIRONMENT_CONFIGS[newEnvironmentCode] }
      if (targetConfig.aspectRatio === "auto") {
        targetConfig.aspectRatio = targetConfig.pxWidth / targetConfig.pxHeight
      }

      const width = targetConfig.pxWidth
      const height = targetConfig.pxHeight
      const initialZoom = Math.round(
        (100 * workspaceSize.width) / targetConfig.pxWidth
      )

      setViewZoomPercent(initialZoom)

      const sizeAdjustedPresentationStore = resizePresentationStore(
        presentationStore,
        {
          width,
          height,
        },
        config.MINIMUM_FRAME_LONG_SIDE,
        config.MAXIMUM_FRAME_LONG_SIDE,
        {
          width: config.FILE_BROWSER_WIDTH,
          height: config.FILE_BROWSER_HEIGHT,
        }
      )
      sizeAdjustedPresentationStore.targetEnvironment = newEnvironmentCode
      loadPresentationStore(sizeAdjustedPresentationStore)
    },
    [
      config.FILE_BROWSER_HEIGHT,
      config.FILE_BROWSER_WIDTH,
      config.MAXIMUM_FRAME_LONG_SIDE,
      config.MINIMUM_FRAME_LONG_SIDE,
      loadPresentationStore,
      presentationStore,
      setViewZoomPercent,
      workspaceSize.width,
    ]
  )

  const zoomIn = useCallback(() => {
    const newZoomPercent = viewZoomPercent + 10 - (viewZoomPercent % 10)
    setViewZoomPercent(newZoomPercent)
  }, [setViewZoomPercent, viewZoomPercent])

  const zoomOut = useCallback(() => {
    let newZoomPercent = viewZoomPercent - 10 - (viewZoomPercent % 10)
    if (newZoomPercent < 10) {
      newZoomPercent = 10
    }
    setViewZoomPercent(newZoomPercent)
  }, [setViewZoomPercent, viewZoomPercent])

  const zoomFit = useCallback(() => {
    const originalZoom = Math.round(
      (100 * workspaceSize.width) / targetEnvironmentConfig.pxWidth
    )
    setViewZoomPercent(originalZoom)
  }, [workspaceSize.width, targetEnvironmentConfig.pxWidth, setViewZoomPercent])

  const providerValue = useMemo<SpectacleUserInterfaceContextProps>(
    () => ({
      workspaceSize,
      setWorkspaceSize,
      isLive,
      setIsLive,
      isGridVisible,
      setIsGridVisible,
      zoomIn,
      zoomOut,
      zoomFit,
      targetEnvironmentConfig,
      activateEnvironment,
    }),
    [
      workspaceSize,
      isLive,
      isGridVisible,
      zoomIn,
      zoomOut,
      zoomFit,
      targetEnvironmentConfig,
      activateEnvironment,
    ]
  )

  return (
    <SpectacleUserInterfaceContext.Provider value={providerValue}>
      {children}
    </SpectacleUserInterfaceContext.Provider>
  )
}

export default SpectacleUserInterfaceContextProvider
