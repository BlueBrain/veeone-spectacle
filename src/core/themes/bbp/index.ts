import { createTheme } from "@mui/material"
import { green, grey, red } from "@mui/material/colors"
import { config } from "../../../config"

const HIDE_CURSOR_CSS = config.DISPLAY_MOUSE_CURSOR
  ? ``
  : `* {
  cursor: none !important;
}
`

export const blueBrainTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: `rgba(0, 125, 222, 1)`,
    },
    secondary: { main: `rgba(62, 197, 255, 1)` },
    error: red,
    success: green,
    info: grey,
    background: {
      default: `rgba(5, 10, 86, 1)`,
      light: `rgba(3, 86, 150, 1)`,
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
// @import url('https://fonts.googleapis.com/css2?family=Titillium+Web:wght@200;300;400;600;700;900&display=swap');

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
