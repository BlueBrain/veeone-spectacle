import {
  Build,
  CloudDownload,
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
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react"
import { SpectacleContext } from "../core/spectacle/SpectacleContext"
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
  const spectacleContext = useContext(SpectacleContext)

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
    spectacleContext.loadPresentation.openModal({
      position: { ...position },
    })
    close()
  }, [close, position, spectacleContext.loadPresentation])

  const savePresentation = useCallback(() => {
    spectacleContext.savePresentation.openModal({
      position: { ...position },
    })
    close()
  }, [close, position, spectacleContext.savePresentation])

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
      },
      {
        label: "Save / Load",
        icon: CloudSync,
        children: [
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
          {
            label: "Test",
            icon: Build,
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
