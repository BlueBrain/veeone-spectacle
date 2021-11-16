import { createTheme } from "@mui/material"
import { green, grey, red } from "@mui/material/colors"
import React from "react"

declare module "@mui/material/styles/createPalette" {
  interface TypeBackground {
    light: React.CSSProperties["color"]
  }
}

export const bbpTheme = createTheme({
  palette: {
    primary: { main: `#007DDE` },
    secondary: { main: `#3ec5ff` },
    error: red,
    success: green,
    info: grey,
    background: {
      default: `rgba(5, 10, 86, 1)`,
      light: `rgba(3, 86, 150, 1)`,
    },
  },
})
