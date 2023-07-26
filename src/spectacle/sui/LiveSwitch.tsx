import React, { useCallback, useMemo } from "react"
import { Box, Switch, Theme } from "@mui/material"
import { useSpectacleUserInterface } from "./SpectacleUserInterfaceContextProvider"
import { SxProps } from "@mui/system"

const LiveSwitch: React.FC = () => {
  const { isLive, setIsLive } = useSpectacleUserInterface()
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
  return (
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
  )
}
export default LiveSwitch
