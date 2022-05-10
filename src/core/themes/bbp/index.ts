import { createTheme } from "@mui/material"
import { green, grey, red } from "@mui/material/colors"
import { ApplicationConfig } from "../../../config/types"
import "./css/colors.css"
import {
  SUISSE_INTL_FONT_FACES,
  TITILLIUM_WEB_FONT_FACES,
} from "./font-imports"

export const getBlueBrainTheme = (config: ApplicationConfig) => {
  const HIDE_CURSOR_CSS = config.DISPLAY_MOUSE_CURSOR
    ? ``
    : `* {
  cursor: none !important;
}
`
  return createTheme({
    palette: {
      mode: "light",
      primary: {
        main: `rgba(0, 125, 222, 1)`,
        pale: `rgba(0, 125, 222, .2)`,
        dark: `rgba(0, 100, 190, 1)`,
      },
      secondary: {
        main: `rgba(62, 197, 255, 1)`,
        pale: `rgba(62, 197, 255, .2)`,
      },
      screen: {
        main: `rgba(30, 30, 30, 1)`,
        pale: `rgba(30, 30, 30, .2)`,
      },
      error: red,
      success: green,
      info: grey,
      background: {
        default: `var(--blue-brain-dark-blue)`,
        light: `var(--blue-brain-light-blue)`,
      },
    },
    branding: { main: `rgba(62, 197, 255, 1)` },
    typography: {
      fontFamily: ['"Titillium Web"', "sans-serif"].join(","),
      fontSize: 12,
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: `
${TITILLIUM_WEB_FONT_FACES}
${SUISSE_INTL_FONT_FACES}

html {
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  font-family: "Titillium Web", sans-serif;
  box-sizing: border-box;
  height: 100%;
  overflow: hidden;
  -ms-overflow-style: none;  /* IE and Edge */
}

body {
  height: 100%;
  margin: 0;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: hsla(0, 0%, 0%, 0.7);
  word-wrap: break-word;
  font-kerning: normal;
  -moz-font-feature-settings: "kern", "liga", "clig", "calt";
  -ms-font-feature-settings: "kern", "liga", "clig", "calt";
  -webkit-font-feature-settings: "kern", "liga", "clig", "calt";
  font-feature-settings: "kern", "liga", "clig", "calt";
  user-select: none;
  touch-action: none;
  scrollbar-width: none;
  background: black;
}

body::-webkit-scrollbar {
  display: none
}

${HIDE_CURSOR_CSS}
`,
      },
      MuiButton: {
        styleOverrides: {
          text: {
            textTransform: "none",
          },
        },
      },
      MuiSvgIcon: {
        styleOverrides: {
          fontSizeLarge: {
            fontSize: "2rem",
          },
        },
      },
    },
  })
}
