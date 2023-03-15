import { Box } from "@mui/material"
import * as React from "react"
import { ReactNode, useEffect, useRef } from "react"

interface SpectacleWorkspaceProps {
  children: ReactNode
}

export default function SpectacleWorkspace({
  children,
}: SpectacleWorkspaceProps) {
  const workspaceRef = useRef<HTMLDivElement>()

  useEffect(() => {
    if (workspaceRef.current) {
      const { width, height } = workspaceRef.current.getBoundingClientRect()
      const aspectRatio = width / height
      console.debug("workspaceRef", width, height, aspectRatio)
    }
  }, [])

  return (
    <Box
      sx={{
        position: "absolute",
        left: "60px",
        right: "0",
        border: "2rem solid red",
        boxSizing: "border-box",
      }}
      ref={workspaceRef}
    >
      {children}
    </Box>
  )
}
