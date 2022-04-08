import React, { useEffect, useRef } from "react"
import { Position } from "../common/types"
import { Box } from "@mui/material"
import PieMenu from "./pie-menu/PieMenu"
import LauncherMenuContextProvider from "./LauncherMenuContextProvider"
import { useConfig } from "../config/AppConfigContext"
import interact from "interactjs"

interface LauncherMenuProps {
  menuId: string
  position: Position
  onClose: (args: CloseLauncherMenuArgs) => void
  onFullyOpen: () => void
}

export interface CloseLauncherMenuArgs {
  menuId: string
}

const LauncherMenu: React.FC<LauncherMenuProps> = ({
  menuId,
  position,
  onClose,
  onFullyOpen,
}) => {
  const config = useConfig()
  const launcherBoxRef = useRef()

  useEffect(() => {
    const launcherInteract = interact(launcherBoxRef.current)

    launcherInteract.on("tap", event => {
      console.debug("Catch tap on launcher menu area")
      event.stopPropagation()
    })

    setTimeout(() => {
      onFullyOpen()
    }, 1000)

    return () => {
      launcherInteract.unset()
    }
  }, [])

  return (
    <LauncherMenuContextProvider
      menuId={menuId}
      position={position}
      onClose={onClose}
    >
      <Box sx={{ transform: `translate(-50%, -50%)` }} ref={launcherBoxRef}>
        <Box
          sx={{
            width: config.LAUNCHER_MENU_SIZE,
            height: config.LAUNCHER_MENU_SIZE,
          }}
        >
          <PieMenu />
        </Box>
      </Box>
    </LauncherMenuContextProvider>
  )
}

export default LauncherMenu
