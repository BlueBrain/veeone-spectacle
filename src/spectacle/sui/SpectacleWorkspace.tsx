import { Box } from "@mui/material"
import * as React from "react"
import { ReactNode, useEffect, useRef } from "react"
import { useSpectacleUserInterface } from "./SpectacleUserInterfaceContextProvider"
import WorkspaceControlPanel from "./WorkspaceControlPanel"
import { useSpectacle } from "../SpectacleStateContext"

interface SpectacleWorkspaceProps {
  children: ReactNode
}

export default function SpectacleWorkspace({
  children,
}: SpectacleWorkspaceProps) {
  const { viewZoomPercent } = useSpectacle()
  const { setWorkspaceSize } = useSpectacleUserInterface()
  const workspaceRef = useRef<HTMLDivElement>()

  useEffect(() => {
    if (workspaceRef.current) {
      const { width, height } = workspaceRef.current.getBoundingClientRect()
      setWorkspaceSize({ width, height })
    }
  }, [setWorkspaceSize])

  return (
    <Box
      sx={{
        position: "absolute",
        left: "60px",
        right: "0",
        boxSizing: "border-box",
        background: "#303030",
        overflow: "hidden",
        height: "100vh",
        width: "calc(100vw - 60px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      ref={workspaceRef}
    >
      <Box
        sx={{
          transform: `scale(${viewZoomPercent}%)`,
        }}
      >
        {children}
      </Box>
      <WorkspaceControlPanel />
    </Box>
  )
}
