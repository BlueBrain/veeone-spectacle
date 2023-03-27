import React, {
  createContext,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react"
import { Size } from "../../common/types"
import { RunningEnvironment } from "../../config/types"
import EnvironmentConfigs, {
  EnvironmentConfig,
} from "../../config/environmentConfigs"
import ENVIRONMENT_CONFIGS from "../../config/environmentConfigs"
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
  viewZoomPercent: number
  setViewZoomPercent(newValue: any): void
  targetEnvironment: RunningEnvironment
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
    viewZoomPercent: 100,
    setViewZoomPercent() {
      throw new Error("Not implemented")
    },
    targetEnvironment: RunningEnvironment.DEV,
    activateEnvironment() {
      throw new Error("Not implemented")
    },
    targetEnvironmentConfig: {
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

  const { presentationStore, loadPresentationStore } = useSpectacle()

  const [workspaceSize, setWorkspaceSize] = useState<Size>({
    width: 0,
    height: 0,
  })

  const [isLive, setIsLive] = useState(false)

  const [isGridVisible, setIsGridVisible] = useState(true)

  const [viewZoomPercent, setViewZoomPercent] = useState(100)

  const [
    targetEnvironment,
    setTargetEnvironment,
  ] = useState<RunningEnvironment>()

  const targetEnvironmentConfig = useMemo(() => {
    return ENVIRONMENT_CONFIGS[targetEnvironment]
  }, [targetEnvironment])

  const activateEnvironment = useCallback(
    (env: RunningEnvironment) => {
      const targetConfig = { ...ENVIRONMENT_CONFIGS[env] }
      if (targetConfig.aspectRatio === "auto") {
        targetConfig.aspectRatio = targetConfig.pxWidth / targetConfig.pxHeight
      }
      console.debug("targetConfig", targetConfig)

      const width = workspaceSize.width
      const height = width / targetConfig.aspectRatio
      const initialZoom = Math.round((100 * width) / targetConfig.pxWidth)

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
      sizeAdjustedPresentationStore.targetEnvironment = env
      loadPresentationStore(sizeAdjustedPresentationStore)
      setViewZoomPercent(initialZoom)
      setTargetEnvironment(env)
    },
    [
      config.FILE_BROWSER_HEIGHT,
      config.FILE_BROWSER_WIDTH,
      config.MAXIMUM_FRAME_LONG_SIDE,
      config.MINIMUM_FRAME_LONG_SIDE,
      loadPresentationStore,
      presentationStore,
      workspaceSize.width,
    ]
  )

  const providerValue = useMemo<SpectacleUserInterfaceContextProps>(
    () => ({
      workspaceSize,
      setWorkspaceSize,
      isLive,
      setIsLive,
      isGridVisible,
      setIsGridVisible,
      viewZoomPercent,
      setViewZoomPercent,
      targetEnvironment,
      targetEnvironmentConfig,
      activateEnvironment,
    }),
    [
      workspaceSize,
      isLive,
      isGridVisible,
      viewZoomPercent,
      targetEnvironment,
      targetEnvironmentConfig,
    ]
  )

  return (
    <SpectacleUserInterfaceContext.Provider value={providerValue}>
      {children}
    </SpectacleUserInterfaceContext.Provider>
  )
}

export default SpectacleUserInterfaceContextProvider
