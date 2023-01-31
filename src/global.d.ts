import React from "react"

declare module "*.module.scss" {
  const content: { [key: string]: string }
  export default content
}

declare module "*.svg" {
  const content: any
  export default content
}

declare global {
  interface Crypto {
    randomUUID: () => string
  }
}

declare module "react" {
  function forwardRef<T, P = {}>(
    render: (props: P, ref: React.Ref<T>) => React.ReactElement | null
  ): (props: P & React.RefAttributes<T>) => React.ReactElement | null
}

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
    screen: SimplePaletteColorOptions
  }

  interface Palette {
    screen: SimplePaletteColorOptions
  }
}

export {}
