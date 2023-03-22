import * as React from "react"
import { useMemo } from "react"
import { CssBaseline, ThemeProvider } from "@mui/material"
import ThemeGradients from "../branding/ThemeGradients"
import SpectacleStateContextProvider from "./SpectacleStateContextProvider"
import SpectacleScreen from "./SpectacleScreen"
import { useConfig } from "../config/AppConfigContext"
import { getBlueBrainTheme } from "../branding/bbp-theme"
import ImageKeeperContextProvider from "../image-keeper/ImageKeeperContextProvider"
import DialogsContextProvider from "../dialogs/DialogsContextProvider"
import PresentationManagerContextProvider from "../presentations/presentation-manager/PresentationManagerContextProvider"
import DialogsPlaceholder from "../dialogs/DialogsPlaceholder"
import VisualKeyboardContextProvider from "../visualkeyboard/VisualKeyboardContextProvider"
import SceneContextProvider from "../scenes/SceneContextProvider"
import { RunningEnvironment } from "../config/types"
import SpectacleUserInterface from "./sui/SpectacleUserInterface"
import SpectacleUserInterfaceContextProvider from "./sui/SpectacleUserInterfaceContextProvider"
import ScreenGridOverlay from "./sui/ScreenGridOverlay"
import NotificationContextProvider from "./notifications/NotificationContextProvider"

export const Spectacle = () => {
  const config = useConfig()
  const blueBrainTheme = useMemo(() => getBlueBrainTheme(config), [config])

  const userInterface = useMemo(() => {
    if (
      [RunningEnvironment.DEV, RunningEnvironment.CLIENT].includes(
        config.RUNNING_ENVIRONMENT
      )
    ) {
      return (
        <SpectacleUserInterfaceContextProvider>
          <SpectacleUserInterface>
            <SpectacleScreen />
            <ScreenGridOverlay />
          </SpectacleUserInterface>
        </SpectacleUserInterfaceContextProvider>
      )
    }
    return <SpectacleScreen />
  }, [config.RUNNING_ENVIRONMENT])

  return (
    <ThemeProvider theme={blueBrainTheme}>
      <CssBaseline />
      <ThemeGradients />
      <NotificationContextProvider>
        <VisualKeyboardContextProvider>
          <SpectacleStateContextProvider>
            <SceneContextProvider>
              <DialogsContextProvider>
                <PresentationManagerContextProvider>
                  <ImageKeeperContextProvider>
                    {userInterface}
                  </ImageKeeperContextProvider>
                  <DialogsPlaceholder />
                </PresentationManagerContextProvider>
              </DialogsContextProvider>
            </SceneContextProvider>
          </SpectacleStateContextProvider>
        </VisualKeyboardContextProvider>
      </NotificationContextProvider>
    </ThemeProvider>
  )
}
