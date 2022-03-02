import React from "react"

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

export {}
