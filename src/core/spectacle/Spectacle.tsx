import * as React from "react"
import { CssBaseline, ThemeProvider } from "@mui/material"
import { blueBrainTheme } from "../themes/bbp"
import ThemeGradients from "../themes/bbp/ThemeGradients"
import SpectacleContextProvider from "./SpectacleContextProvider"
import SpectacleScreen from "./SpectacleScreen"

export const Spectacle = () => {
  return (
    <ThemeProvider theme={blueBrainTheme}>
      <CssBaseline />
      <ThemeGradients />
      <SpectacleContextProvider>
        <SpectacleScreen />
      </SpectacleContextProvider>
    </ThemeProvider>
  )
}
