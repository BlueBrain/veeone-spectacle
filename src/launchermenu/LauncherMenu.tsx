import React, { useCallback, useContext } from "react"
import { Position, Size } from "../common/types"
import { useDispatch } from "react-redux"
import { addFrame } from "../core/redux/actions"
import { ContentBlockTypes } from "../contentblocks/types"
import { generateFrameId } from "../core/frames/utils"
import { config } from "../config"
import { makeFramePositionSafe } from "../core/frames/makeFramePositionSafe"
import { SpectacleContext } from "../core/spectacle/SpectacleContext"
import { Box, Grow } from "@mui/material"
import PieMenu from "./pie-menu/PieMenu"
import { MenuData } from "./types"
import {
  CloudDownload,
  CloudSync,
  CloudUpload,
  GridView,
  ImageSearch,
  Language,
  Person,
  ScreenShare,
} from "@mui/icons-material"

interface LauncherMenuProps {
  menuId: string
  position: Position
  onClose: (args: CloseLauncherMenuArgs) => void
}

interface OpenNewFrameArgs {
  type: ContentBlockTypes
  size: Size
}

export interface CloseLauncherMenuArgs {
  menuId: string
}

const LauncherMenu: React.FC<LauncherMenuProps> = ({
  menuId,
  position,
  onClose,
}) => {
  const dispatch = useDispatch()
  const spectacleContext = useContext(SpectacleContext)

  const close = useCallback(() => {
    onClose({ menuId })
  }, [menuId, onClose])

  const openNewFrameFromLauncher = ({ type, size }: OpenNewFrameArgs) => {
    close()
    position = makeFramePositionSafe(position, size)

    dispatch(
      addFrame({
        frameId: generateFrameId(),
        position,
        size,
        type,
        contentData: null,
      })
    )
  }

  const menuData: MenuData = {
    items: [
      {
        label: "Open media",
        icon: ImageSearch,
        action: () => {
          openNewFrameFromLauncher({
            type: ContentBlockTypes.FileBrowser,
            size: {
              width: config.FILE_BROWSER_WIDTH,
              height: config.FILE_BROWSER_HEIGHT,
            },
          })
        },
      },
      {
        label: "Scenes",
        icon: GridView,
        action: () => {
          throw "Not implemented"
        },
      },
      {
        label: "Save / Load",
        icon: CloudSync,
        children: [
          {
            label: "Open",
            icon: CloudDownload,
            action: () => {
              spectacleContext.loadPresentation.openModal({
                position: { ...position },
              })
              close()
            },
          },
          {
            label: "Save",
            icon: CloudUpload,
            action: () => {
              spectacleContext.savePresentation.openModal({
                position: { ...position },
              })
              close()
            },
          },
        ],
      },
      {
        label: "Login",
        icon: Person,
        action: () => {
          throw "Not implemented"
        },
      },
      {
        label: "Open web",
        icon: Language,
        action: () => {
          throw "Not implemented"
        },
      },
      {
        label: "Share your screen",
        icon: ScreenShare,
        action: () => {
          throw "Not implemented"
        },
      },
    ],
  }

  return (
    <Box sx={{ transform: `translate(-50%, -50%)` }}>
      <Grow in={true} timeout={300}>
        <Box
          sx={{
            // background: `rgba(255,0,0,.3)`,
            width: "30vh",
            height: "30vh",
          }}
        >
          <PieMenu menuData={menuData} />
        </Box>
      </Grow>
    </Box>
  )
}

export default LauncherMenu
