import * as React from "react"

import { Box, Button } from "@mui/material"
import { useConfig } from "../../config/AppConfigContext"
import { useSpectacle } from "../SpectacleStateContext"
import { useCallback } from "react"
import { resizePresentationStore } from "../../presentations/resizing"
import { RunningEnvironment } from "../../config/types"
import ENVIRONMENT_CONFIGS from "../../config/environmentConfigs"
import { useSpectacleUserInterface } from "./SpectacleUserInterfaceContextProvider"

interface ChooserButtonProps {
  label: string
  onClick(): void
}

function ChooserButton({ label, onClick }: ChooserButtonProps) {
  return (
    <Box
      sx={{
        minWidth: "18rem",
        padding: "0.2rem",
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
      }}
    >
      <Button
        variant={"contained"}
        sx={{ display: "flex", flexGrow: "1" }}
        onClick={onClick}
      >
        {label}
      </Button>
    </Box>
  )
}

interface ChooseDestinationEnvironmentProps {
  onEnvironmentSelected(): void
}

export default function ChooseDestinationEnvironment({
  onEnvironmentSelected,
}: ChooseDestinationEnvironmentProps) {
  const { activateEnvironment } = useSpectacleUserInterface()

  return (
    <Box
      sx={{
        width: "100vw",
        height: "100vh",
        color: "white",
        background: "rgba(0, 0, 0, .6)",
        position: "fixed",
        left: 0,
        top: 0,
        display: "flex",
        flexGrow: "1",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Box sx={{ fontSize: "1rem", paddingBottom: "1rem" }}>
        Choose destination environment:
      </Box>
      <ChooserButton
        onClick={() => {
          activateEnvironment(RunningEnvironment.THIRD_FLOOR_LEFT_DISPLAY)
          onEnvironmentSelected()
        }}
        label={"Third floor display wall"}
      />
      <ChooserButton
        onClick={() => {
          activateEnvironment(RunningEnvironment.FIFTH_FLOOR_DISPLAY_WALL)
          onEnvironmentSelected()
        }}
        label={"Fifth floor display wall"}
      />
      <ChooserButton
        onClick={() => {
          activateEnvironment(RunningEnvironment.SIXTH_FLOOR_DISPLAY_WALL)
          onEnvironmentSelected()
        }}
        label={"Sixth floor display wall"}
      />
      <ChooserButton
        onClick={() => {
          activateEnvironment(RunningEnvironment.OPENDECK)
          onEnvironmentSelected()
        }}
        label={"Opendeck"}
      />
    </Box>
  )
}
