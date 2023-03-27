import * as React from "react"
import { ReactNode, useCallback, useState } from "react"
import { Box, IconButton } from "@mui/material"
import { CastConnected } from "@mui/icons-material"
import ChooseDestinationEnvironment from "./ChooseDestinationEnvironment"
import SpectacleWorkspace from "./SpectacleWorkspace"

interface SpectacleUserInterfaceProps {
  children: ReactNode
}

export default function SpectacleUserInterface({
  children,
}: SpectacleUserInterfaceProps) {
  const [isEnvironmentPickerVisible, setIsEnvironmentPickerVisible] = useState(
    false
  )

  const toggleEnvironmentPickerVisible = useCallback(
    () => setIsEnvironmentPickerVisible(value => !value),
    []
  )

  return (
    <Box sx={{ position: "relative", fontSize: "10px" }}>
      <Box
        sx={{
          background: "#1E1E1E",
          position: "absolute",
          left: 0,
          top: 0,
          width: "60px",
          height: "100vh",
          zIndex: "99999",
          display: "flex",
          flexGrow: "1",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <IconButton onClick={toggleEnvironmentPickerVisible}>
          <CastConnected sx={{ color: "white" }} />
        </IconButton>
      </Box>

      <SpectacleWorkspace>{children}</SpectacleWorkspace>

      {isEnvironmentPickerVisible ? (
        <ChooseDestinationEnvironment
          onEnvironmentSelected={() => setIsEnvironmentPickerVisible(false)}
        />
      ) : null}
    </Box>
  )
}
