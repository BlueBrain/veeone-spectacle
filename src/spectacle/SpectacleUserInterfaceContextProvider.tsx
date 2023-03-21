import React, { createContext, ReactNode, useMemo, useState } from "react"
import { Size } from "../common/types"

interface SpectacleUserInterfaceContextProviderProps {
  children: ReactNode
}

interface SpectacleUserInterfaceContextProps {
  workspaceSize: Size
  setWorkspaceSize(newSize: Size): void
  isLive: boolean
  setIsLive(newValue: boolean): void
}

const SpectacleUserInterfaceContext = createContext<SpectacleUserInterfaceContextProps>(
  {
    workspaceSize: { width: 0, height: 0 },
    setWorkspaceSize(newSize: Size) {
      throw new Error("Not implemented")
    },
    isLive: false,
    setIsLive(newValue: boolean) {
      throw new Error("Not implemented")
    },
  }
)

export const useSpectacleUserInterface = () =>
  React.useContext(SpectacleUserInterfaceContext)

const SpectacleUserInterfaceContextProvider: React.FC<SpectacleUserInterfaceContextProviderProps> = ({
  children,
}) => {
  const [workspaceSize, setWorkspaceSize] = useState<Size>({
    width: 0,
    height: 0,
  })

  const [isLive, setIsLive] = useState(false)

  const providerValue = useMemo<SpectacleUserInterfaceContextProps>(
    () => ({
      workspaceSize,
      setWorkspaceSize,
      isLive,
      setIsLive,
    }),
    [workspaceSize, isLive]
  )

  return (
    <SpectacleUserInterfaceContext.Provider value={providerValue}>
      {children}
    </SpectacleUserInterfaceContext.Provider>
  )
}

export default SpectacleUserInterfaceContextProvider
