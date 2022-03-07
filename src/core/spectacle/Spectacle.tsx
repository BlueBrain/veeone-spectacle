import * as React from "react"
import { Desk } from "../desk"
import { CssBaseline, styled, ThemeProvider } from "@mui/material"
import { blueBrainTheme } from "../themes/bbp"
import { config } from "../../config"
import ThemeGradients from "../themes/bbp/ThemeGradients"
import SpectacleContextProvider from "./SpectacleContextProvider"

const StyledDeskWrapper = styled("div")({
  width: `${config.VIEWPORT_WIDTH}px`,
  height: `${config.VIEWPORT_HEIGHT}px`,
  overflow: "hidden",
  contain: `content`,
})

export const Spectacle = () => {
  return (
    <ThemeProvider theme={blueBrainTheme}>
      <CssBaseline />
      <ThemeGradients />
      <SpectacleContextProvider>
        <StyledDeskWrapper>
          <Desk />
        </StyledDeskWrapper>
      </SpectacleContextProvider>
    </ThemeProvider>
  )
}
