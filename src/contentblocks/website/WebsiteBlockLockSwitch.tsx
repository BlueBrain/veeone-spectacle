import { Box, Switch } from "@mui/material"
import { LockOpenRounded, LockRounded } from "@mui/icons-material"
import React, { useCallback } from "react"
import { useWebsiteBlock } from "./WebsiteBlockContext"

const WebsiteBlockLockSwitch: React.FC = () => {
  const {
    deactivateInteractiveMode,
    activateInteractiveMode,
    isInteractiveModeOn,
  } = useWebsiteBlock()

  const onSwitchChange = useCallback(
    event => {
      if (event.target.checked) {
        deactivateInteractiveMode()
      } else {
        activateInteractiveMode()
      }
    },
    [activateInteractiveMode, deactivateInteractiveMode]
  )

  return (
    <Box sx={{ display: `flex`, alignItems: `center` }}>
      <LockOpenRounded />
      <Switch onChange={onSwitchChange} checked={!isInteractiveModeOn} />
      <LockRounded />
    </Box>
  )
}

export default WebsiteBlockLockSwitch
