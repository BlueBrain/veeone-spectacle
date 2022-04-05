import React from "react"
import { Position } from "../common/types"
import { Box, Grow } from "@mui/material"
import PieMenu from "./pie-menu/PieMenu"
import LauncherMenuContextProvider from "./LauncherMenuContextProvider"
import { useConfig } from "../config/AppConfigContext"

interface LauncherMenuProps {
  menuId: string
  position: Position
  onClose: (args: CloseLauncherMenuArgs) => void
}

export interface CloseLauncherMenuArgs {
  menuId: string
}

const LauncherMenu: React.FC<LauncherMenuProps> = ({
  menuId,
  position,
  onClose,
}) => {
  const config = useConfig()
  return (
    <LauncherMenuContextProvider
      menuId={menuId}
      position={position}
      onClose={onClose}
    >
      <Box sx={{ transform: `translate(-50%, -50%)` }}>
        <Box
          sx={{
            // background: `rgba(255,0,0,.3)`,
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
