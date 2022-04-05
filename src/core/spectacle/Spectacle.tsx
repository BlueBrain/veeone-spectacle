import * as React from "react"
import { useMemo } from "react"
import { CssBaseline, ThemeProvider } from "@mui/material"
import ThemeGradients from "../themes/bbp/ThemeGradients"
import SpectacleContextProvider from "./SpectacleContextProvider"
import SpectacleScreen from "./SpectacleScreen"
import { useConfig } from "../../config/AppConfigContext"
import { getBlueBrainTheme } from "../themes/bbp"

export const Spectacle = () => {
  const config = useConfig()
  const blueBrainTheme = useMemo(() => getBlueBrainTheme(config), [config])

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
