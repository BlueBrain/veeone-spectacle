import * as React from "react"
import { Desk } from "../desk"
import { styled, ThemeProvider } from "@mui/material/styles"
import { bbpTheme } from "../themes/bbp"
import { config } from "../../config"

const StyledDeskWrapper = styled("div")({
  width: `${config.VIEWPORT_WIDTH}px`,
  height: `${config.VIEWPORT_HEIGHT}px`,
  overflow: "hidden",
  contain: `content`,
})

export const Spectacle = () => {
  if (!config.DISPLAY_MOUSE_CURSOR) {
    require("./hideCursor.scss")
  }
  return (
    <ThemeProvider theme={bbpTheme}>
      <StyledDeskWrapper>
        <Desk />
      </StyledDeskWrapper>
    </ThemeProvider>
  )
}
