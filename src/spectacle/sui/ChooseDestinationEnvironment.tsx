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
  onEnvironmentSelected(env: RunningEnvironment): void
}

export default function ChooseDestinationEnvironment({
  onEnvironmentSelected,
}: ChooseDestinationEnvironmentProps) {
  const config = useConfig()
  const { workspaceSize } = useSpectacleUserInterface()
  const { presentationStore, loadPresentationStore } = useSpectacle()

  const activateEnvironment = useCallback(
    (targetEnvironment: RunningEnvironment) => {
      const targetConfig = { ...ENVIRONMENT_CONFIGS[targetEnvironment] }
      if (targetConfig.aspectRatio === "auto") {
        targetConfig.aspectRatio = targetConfig.pxWidth / targetConfig.pxHeight
      }
      console.debug("targetConfig", targetConfig)

      // todo scale should be configurable ("zoom")
      const scale = 1.0
      const width = scale * workspaceSize.width
      const height = scale * (width / targetConfig.aspectRatio)

      const sizeAdjustedPresentationStore = resizePresentationStore(
        presentationStore,
        {
          width,
          height,
        },
        config.MINIMUM_FRAME_LONG_SIDE,
        config.MAXIMUM_FRAME_LONG_SIDE,
        {
          width: config.FILE_BROWSER_WIDTH,
          height: config.FILE_BROWSER_HEIGHT,
        }
      )
      sizeAdjustedPresentationStore.targetEnvironment = targetEnvironment
      loadPresentationStore(sizeAdjustedPresentationStore)
      onEnvironmentSelected(targetEnvironment)
    },
    [
      config.FILE_BROWSER_HEIGHT,
      config.FILE_BROWSER_WIDTH,
      config.MAXIMUM_FRAME_LONG_SIDE,
      config.MINIMUM_FRAME_LONG_SIDE,
      loadPresentationStore,
      presentationStore,
      workspaceSize.width,
    ]
  )

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
        onClick={() =>
          activateEnvironment(RunningEnvironment.THIRD_FLOOR_LEFT_DISPLAY)
        }
        label={"Third floor display wall"}
      />
      <ChooserButton
        onClick={() =>
          activateEnvironment(RunningEnvironment.FIFTH_FLOOR_DISPLAY_WALL)
        }
        label={"Fifth floor display wall"}
      />
      <ChooserButton
        onClick={() =>
          activateEnvironment(RunningEnvironment.SIXTH_FLOOR_DISPLAY_WALL)
        }
        label={"Sixth floor display wall"}
      />
      <ChooserButton
        onClick={() => activateEnvironment(RunningEnvironment.OPENDECK)}
        label={"Opendeck"}
      />
    </Box>
  )
}
