import { Box } from "@mui/material"
import * as React from "react"
import { ReactNode, useEffect, useRef } from "react"
import { useSpectacleUserInterface } from "./SpectacleUserInterfaceContextProvider"
import WorkspaceControlPanel from "./sui/WorkspaceControlPanel"

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
        padding: "2rem",
        boxSizing: "border-box",
        background: "#303030",
        overflow: "hidden",
        height: "100vh",
        maxWidth: "100vw",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      ref={workspaceRef}
    >
      {children}
      <WorkspaceControlPanel />
    </Box>
  )
}
