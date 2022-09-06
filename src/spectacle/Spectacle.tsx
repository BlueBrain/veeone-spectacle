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

export const Spectacle = () => {
  const config = useConfig()
  const blueBrainTheme = useMemo(() => getBlueBrainTheme(config), [config])

  return (
    <ThemeProvider theme={blueBrainTheme}>
      <CssBaseline />
      <ThemeGradients />
      <VisualKeyboardContextProvider>
        <SpectacleStateContextProvider>
          <SceneContextProvider>
            <DialogsContextProvider>
              <PresentationManagerContextProvider>
                <ImageKeeperContextProvider>
                  <SpectacleScreen />
                </ImageKeeperContextProvider>
                <DialogsPlaceholder />
              </PresentationManagerContextProvider>
            </DialogsContextProvider>
          </SceneContextProvider>
        </SpectacleStateContextProvider>
      </VisualKeyboardContextProvider>
    </ThemeProvider>
  )
}
