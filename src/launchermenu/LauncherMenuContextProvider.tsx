import {
  CloudDownload,
  CloudQueueRounded,
  CloudSync,
  CloudUpload,
  GridView,
  ImageSearch,
  Language,
  Person,
  ScreenShare,
} from "@mui/icons-material"
import { ContentBlockTypes } from "../contentblocks/types"
import { config } from "../config"
import LauncherMenuContext, {
  LauncherMenuContextProps,
} from "./LauncherMenuContext"
import React, { useCallback, useEffect, useMemo, useState } from "react"
import { useSpectacle, ViewMode } from "../core/spectacle/SpectacleContext"
import { makeFramePositionSafe } from "../core/frames/makeFramePositionSafe"
import { addFrame } from "../core/redux/actions"
import { generateFrameId } from "../core/frames/utils"
import { useDispatch } from "react-redux"
import { Position, Size } from "../common/types"
import { CloseLauncherMenuArgs } from "./LauncherMenu"
import { MenuData } from "./types"

interface OpenNewFrameArgs {
  type: ContentBlockTypes
  size: Size
}

interface LauncherMenuContextProviderProps {
  menuId: string
  position: Position
  onClose: (args: CloseLauncherMenuArgs) => void
}

const LauncherMenuContextProvider: React.FC<LauncherMenuContextProviderProps> = ({
  menuId,
  position,
  onClose,
  children,
}) => {
  const spectacleContext = useSpectacle()

  const dispatch = useDispatch()

  const close = useCallback(() => {
    onClose({ menuId })
  }, [menuId, onClose])

  const openNewFrameFromLauncher = useCallback(
    ({ type, size }: OpenNewFrameArgs) => {
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
    },
    []
  )

  const openMedia = useCallback(() => {
    openNewFrameFromLauncher({
      type: ContentBlockTypes.FileBrowser,
      size: {
        width: config.FILE_BROWSER_WIDTH,
        height: config.FILE_BROWSER_HEIGHT,
      },
    })
  }, [openNewFrameFromLauncher])

  const openPresentation = useCallback(() => {
    spectacleContext.openPresentation.openModal({
      position: { ...position },
    })
    close()
  }, [close, position, spectacleContext.openPresentation])

  const savePresentation = useCallback(() => {
    spectacleContext.savePresentation.openModal({
      position: { ...position },
    })
    close()
  }, [close, position, spectacleContext.savePresentation])

  const switchToScenesView = useCallback(() => {
    console.debug("switchToScenesView to scene overview...")
    close()
    spectacleContext.setViewMode(ViewMode.SceneOverview)
  }, [close, spectacleContext])

  const newPresentation = useCallback(() => {
    // todo make new presentation
    close()
  }, [close])

  const [menuData, setMenuData] = useState<MenuData>({
    items: [
      {
        label: "Open media",
        icon: ImageSearch,
        action: openMedia,
      },
      {
        label: "Scenes",
        icon: GridView,
        action: switchToScenesView,
      },
      {
        label: "Save / Open",
        icon: CloudSync,
        children: [
          {
            label: "New",
            icon: CloudQueueRounded,
            action: newPresentation,
          },
          {
            label: "Open",
            icon: CloudUpload,
            action: openPresentation,
          },
          {
            label: "Save",
            icon: CloudDownload,
            action: savePresentation,
          },
        ],
      },
      {
        label: "Login",
        isEnabled: false,
        icon: Person,
      },
      {
        label: "Open web",
        isEnabled: false,
        icon: Language,
        children: [
          {
            label: "EPFL",
            icon: Language,
          },
          {
            label: "BBP",
            icon: Language,
          },
          {
            label: "Browser",
            icon: Language,
          },
        ],
      },
      {
        label: "Share your screen",
        isEnabled: false,
        icon: ScreenShare,
      },
    ],
  })

  const providerValue: LauncherMenuContextProps = useMemo(
    () => ({
      menuData: menuData,
      setMenuData: setMenuData,
    }),
    [menuData]
  )

  return (
    <LauncherMenuContext.Provider value={providerValue}>
      {children}
    </LauncherMenuContext.Provider>
  )
}

export default LauncherMenuContextProvider
