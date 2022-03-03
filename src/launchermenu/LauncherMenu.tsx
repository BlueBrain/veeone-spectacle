import React from "react"
import { Position } from "../common/types"
import { Box, Grow } from "@mui/material"
import PieMenu from "./pie-menu/PieMenu"
import LauncherMenuContextProvider from "./LauncherMenuContextProvider"

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
            width: "max(350px, 30vh)",
            height: "max(350px, 30vh)",
          }}
        >
          <PieMenu />
        </Box>
      </Box>
    </LauncherMenuContextProvider>
  )
}

export default LauncherMenu
