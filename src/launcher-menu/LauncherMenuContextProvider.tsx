import {
  AddBoxOutlined,
  CloudSync,
  CloudUpload,
  GridView,
  ImageSearch,
  Language,
  Person,
  Save,
  SaveAs,
  ScreenShare,
} from "@mui/icons-material"
import { ContentBlockTypes } from "../contentblocks/types"
import LauncherMenuContext, {
  LauncherMenuContextProps,
} from "./LauncherMenuContext"
import React, { useCallback, useMemo, useState } from "react"
import { useSpectacle, ViewMode } from "../spectacle/SpectacleContext"
import { makeFramePositionSafe } from "../frames/makeFramePositionSafe"
import { addFrame } from "../redux/actions"
import { generateFrameId } from "../frames/utils"
import { useDispatch } from "react-redux"
import { Position, Size } from "../common/types"
import { CloseLauncherMenuArgs } from "./LauncherMenu"
import { MenuData } from "./types"
import LauncherMenuItem from "./LauncherMenuItem"
import { useConfig } from "../config/AppConfigContext"
import { usePresentationManager } from "../presentations/presentation-manager/PresentationManagerContext"
import { FrameData } from "../types"

interface OpenNewFrameArgs {
  type: ContentBlockTypes
  size: Size
  contentData?: FrameData
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
  const config = useConfig()
  const spectacleContext = useSpectacle()
  const presentationManager = usePresentationManager()

  const dispatch = useDispatch()

  const close = useCallback(() => {
    onClose({ menuId })
  }, [menuId, onClose])

  const openNewFrameFromLauncher = useCallback(
    ({ type, size, contentData = null }: OpenNewFrameArgs) => {
      close()
      position = makeFramePositionSafe(position, size, {
        width: config.VIEWPORT_WIDTH,
        height: config.VIEWPORT_HEIGHT,
      })

      dispatch(
        addFrame({
          frameId: generateFrameId(),
          position,
          size,
          type,
          contentData,
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
  }, [
    config.FILE_BROWSER_HEIGHT,
    config.FILE_BROWSER_WIDTH,
    openNewFrameFromLauncher,
  ])

  const openPresentation = useCallback(async () => {
    close()
    await presentationManager.openPresentation({ position })
  }, [close, position, presentationManager])

  const savePresentationAs = useCallback(async () => {
    close()
    await presentationManager.savePresentationAs({ position })
  }, [close, position, presentationManager])

  const savePresentation = useCallback(async () => {
    close()
    await presentationManager.savePresentation({ position })
  }, [close, position, presentationManager])

  const switchToScenesView = useCallback(() => {
    close()
    console.debug("switchToScenesView to scene overview...")
    spectacleContext.setViewMode(ViewMode.SceneOverview)
  }, [close, spectacleContext])

  const newPresentation = useCallback(async () => {
    close()
    await presentationManager.newPresentation({ position })
  }, [close, position, presentationManager])

  const openWebsite = useCallback(
    async (websiteUrl: string) => {
      close()
      openNewFrameFromLauncher({
        type: ContentBlockTypes.Website,
        size: {
          width: config.WEBSITE_BLOCK_DEFAULT_WIDTH,
          height: config.WEBSITE_BLOCK_DEFAULT_HEIGHT,
        },
        contentData: {
          websiteUrl,
        },
      })
    },
    [
      close,
      config.WEBSITE_BLOCK_DEFAULT_HEIGHT,
      config.WEBSITE_BLOCK_DEFAULT_WIDTH,
      openNewFrameFromLauncher,
    ]
  )

  const [menuData, setMenuData] = useState<MenuData>({
    items: [
      new LauncherMenuItem({
        label: "Open media",
        icon: ImageSearch,
        action: openMedia,
      }),
      new LauncherMenuItem({
        label: "Scenes",
        icon: GridView,
        action: switchToScenesView,
      }),
      new LauncherMenuItem({
        label: "Save / Open",
        icon: CloudSync,
        children: [
          new LauncherMenuItem({
            label: "New",
            icon: AddBoxOutlined,
            action: newPresentation,
          }),
          new LauncherMenuItem({
            label: "Open",
            icon: CloudUpload,
            action: openPresentation,
          }),
          new LauncherMenuItem({
            label: "Save",
            icon: Save,
            action: savePresentation,
          }),
          new LauncherMenuItem({
            label: "Save as",
            icon: SaveAs,
            action: savePresentationAs,
          }),
        ],
      }),

      new LauncherMenuItem({
        label: "Login",
        isEnabled: false,
        icon: Person,
      }),

      new LauncherMenuItem({
        label: (
          <>
            Share your
            <br />
            screen
          </>
        ),
        isEnabled: false,
        icon: ScreenShare,
      }),

      new LauncherMenuItem({
        label: "Open web",
        isEnabled: true,
        icon: Language,
        children: [
          new LauncherMenuItem({
            label: (
              <>
                Real Neuron
                <br />
                Challenge
              </>
            ),
            icon: Language,
            action: () =>
              openWebsite("https://bbp.epfl.ch/therealneuronchallenge/"),
          }),
          new LauncherMenuItem({
            label: "Cell Atlas",
            icon: Language,
            action: () => openWebsite("https://bbp.epfl.ch/nexus/cell-atlas/"),
          }),
          // new LauncherMenuItem({
          //   label: "EPFL",
          //   icon: Language,
          //   action: () => openWebsite("https://epfl.ch"),
          // }),
          // new LauncherMenuItem({
          //   label: "BBP",
          //   icon: Language,
          //   action: () =>
          //     openWebsite("https://www.epfl.ch/research/domains/bluebrain/"),
          // }),
          // new LauncherMenuItem({
          //   label: "Browser",
          //   icon: Language,
          // }),
        ],
      }),
    ],
  })

  const providerValue: LauncherMenuContextProps = useMemo(
    () => ({
      menuData,
      setMenuData,
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
