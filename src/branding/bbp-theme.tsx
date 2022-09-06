import {
  activeLinkColor,
  antiFlashWhite,
  cetaceanBlue,
  primaryTextColor,
  processBlue,
  smashedPumpkin,
  strikingRed,
  wageningenGreen,
} from "./colors"
import {
  SUISSE_INTL_FONT_FACES,
  TITILLIUM_WEB_FONT_FACES,
} from "./font-imports"

import { createTheme, PaletteColorOptions, ThemeOptions } from "@mui/material"
import "./colors.css"

import React from "react"
import { ApplicationConfig } from "../config/types"

declare module "@mui/material/styles/createPalette" {
  interface TypeBackground {
    light: React.CSSProperties["color"]
  }
}

declare module "@mui/material/styles" {
  interface Theme {
    branding: {
      main: string
    }
  }

  interface ThemeOptions {
    branding: {
      main: string
    }
  }

  interface SimplePaletteColorOptions {
    pale: string
  }

  interface PaletteColor {
    pale: string
  }

  interface PaletteOptions {
    neutral: PaletteColorOptions
  }
}

export const getBlueBrainTheme = (config: ApplicationConfig) => {
  const HIDE_CURSOR_CSS = config.DISPLAY_MOUSE_CURSOR
    ? ``
    : `* {
  cursor: none !important;
}
`
  const themeOptions: ThemeOptions = {
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
      neutral: {
        main: `rgba(250, 250, 250, 1)`,
        pale: `rgba(220, 220, 220, 1)`,
        dark: `rgba(230, 230, 230, 1)`,
      },
      background: {
        default: antiFlashWhite,
      },
      info: {
        main: processBlue,
        pale: processBlue,
      },
      success: {
        main: wageningenGreen,
        pale: wageningenGreen,
      },
      warning: {
        main: smashedPumpkin,
        pale: smashedPumpkin,
      },
      error: {
        main: strikingRed,
        pale: strikingRed,
      },
      text: {
        primary: primaryTextColor,
      },
      action: {
        active: activeLinkColor,
      },
      screen: {
        main: cetaceanBlue,
        pale: processBlue,
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
  font-size: ${config.BASE_FONT_SIZE}px;
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
  }
  return createTheme(themeOptions)
}
