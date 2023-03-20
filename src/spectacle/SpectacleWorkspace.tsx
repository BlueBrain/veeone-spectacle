import { Box } from "@mui/material"
import * as React from "react"
import { ReactNode, useEffect, useRef } from "react"
import { Size } from "../common/types"
import { useSpectacleUserInterface } from "./SpectacleUserInterfaceContextProvider"

interface SpectacleWorkspaceProps {
  children: ReactNode
}

export default function SpectacleWorkspace({
  children,
}: SpectacleWorkspaceProps) {
  const { setWorkspaceSize } = useSpectacleUserInterface()
  const workspaceRef = useRef<HTMLDivElement>()

  useEffect(() => {
    if (workspaceRef.current) {
      const { width, height } = workspaceRef.current.getBoundingClientRect()
      const aspectRatio = width / height
      console.debug("workspaceRef", width, height, aspectRatio)
      setWorkspaceSize({ width, height })
    }
  }, [setWorkspaceSize])

  return (
    <Box
      sx={{
        position: "absolute",
        left: "60px",
        right: "0",
        border: "2rem solid red",
        boxSizing: "border-box",
        background: "green",
        overflow: "hidden",
        height: "100vh",
        maxWidth: "100vw",
      }}
      ref={workspaceRef}
    >
      {children}
    </Box>
  )
}
