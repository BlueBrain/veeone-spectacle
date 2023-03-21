import { Box, IconButton, Switch, Theme, Tooltip } from "@mui/material"
import React, { MouseEvent, useCallback, useMemo } from "react"
import {
  GridOff,
  GridOn,
  ZoomIn,
  ZoomOut,
  ZoomOutMap,
} from "@mui/icons-material"
import { useSpectacleUserInterface } from "../SpectacleUserInterfaceContextProvider"
import { SxProps } from "@mui/system"

const WorkspaceControlPanel: React.FC = () => {
  const {
    isLive,
    setIsLive,
    isGridVisible,
    setIsGridVisible,
  } = useSpectacleUserInterface()
  const onSwitchChange = useCallback(
    (event: React.ChangeEvent, checked: boolean) => {
      setIsLive(checked)
    },
    [setIsLive]
  )

  const liveLabelSx = useMemo<SxProps>(
    () => (theme: Theme) =>
      isLive
        ? {
            color: theme.palette.success.main,
            fontWeight: "bold",
          }
        : {
            opacity: "0.3",
          },
    [isLive]
  )
  const offlineLabelSx = useMemo<SxProps>(
    () => (theme: Theme) =>
      !isLive
        ? {
            color: theme.palette.error.main,
            fontWeight: "bold",
          }
        : {
            opacity: "0.3",
          },
    [isLive]
  )

  const onIconButtonClick = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      setIsGridVisible(!isGridVisible)
    },
    [isGridVisible]
  )

  return (
    <Box
      sx={{
        background: "#1e1e1e",
        color: "white",
        position: "absolute",
        left: "50%",
        bottom: "10%",
        transform: "translateX(-50%)",
        borderRadius: "0.5rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <Box sx={offlineLabelSx} onClick={() => setIsLive(false)}>
          Offline
        </Box>
        <Switch color={"success"} checked={isLive} onChange={onSwitchChange} />
        <Box sx={liveLabelSx} onClick={() => setIsLive(true)}>
          Live
        </Box>
      </Box>

      <Box sx={{ width: "2rem" }} />

      <Box>
        <IconButton>
          <ZoomIn />
        </IconButton>
      </Box>
      <Box>
        <IconButton>
          <ZoomOutMap />
        </IconButton>
      </Box>
      <Box>
        <IconButton>
          <ZoomOut />
        </IconButton>
      </Box>

      <Box sx={{ width: "2rem" }} />

      <Box>
        <Tooltip title={"Display or hide individual screen bevels"}>
          <IconButton onClick={onIconButtonClick}>
            {isGridVisible ? <GridOff /> : <GridOn />}
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  )
}

export default WorkspaceControlPanel
