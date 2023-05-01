import * as React from "react"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { Frame } from "../frames"
import { LauncherMenu } from "../launcher-menu"
import interact from "interactjs"
import { Target } from "@interactjs/types"
import { Position } from "../common/types"
import { generateRandomId } from "../common/random"
import { CloseLauncherMenuArgs } from "../launcher-menu/LauncherMenu"
import { DeskBranding } from "./DeskBranding"
import { Box } from "@mui/material"
import { useSpectacle } from "../spectacle/SpectacleStateContext"
import { useConfig } from "../config/AppConfigContext"
import { LauncherMenuData, LauncherMenuId } from "../launcher-menu/types"
import _ from "lodash"
import VersionLabel from "./VersionLabel"
import { FullscreenLayer } from "./fullscreen"
import { useDesk } from "./DeskContext"

interact.pointerMoveTolerance(4)

function isAnyLauncherNearby(
  position: Position,
  launcherMenus: LauncherMenuData[]
) {
  return launcherMenus.some(launcher => {
    // todo this is hardcoded for now - should be calculated from launcher size
    const top = launcher.position.top - 200
    const bottom = launcher.position.top + 200
    const left = launcher.position.left - 200
    const right = launcher.position.left + 200
    return (
      top <= position.top &&
      position.top <= bottom &&
      left <= position.left &&
      position.left <= right
    )
  })
}

const Desk: React.FC = () => {
  const config = useConfig()
  const deskRef = useRef()
  const { scene } = useDesk()
  const {
    presentationStore,
    deactivateAllFrames,
    viewZoomPercent,
  } = useSpectacle()
  const meta = presentationStore.meta
  const [launcherMenus, setLauncherMenus] = useState<LauncherMenuData[]>([])

  const openLauncherMenu = useCallback(
    ({ top, left }: Position) => {
      const baseFontSize = config.BASE_FONT_SIZE

      const minTop = (config.LAUNCHER_MENU_SAFETY_MARGIN_REM * baseFontSize) / 2
      const maxTop = config.VIEWPORT_HEIGHT - minTop

      const minLeft =
        (config.LAUNCHER_MENU_SAFETY_MARGIN_REM * baseFontSize) / 2
      const maxLeft = config.VIEWPORT_WIDTH - minLeft

      const deskRect = (deskRef.current as HTMLDivElement).getBoundingClientRect()

      const relativeLeft = ((left - deskRect.left) * 100) / viewZoomPercent
      const relativeTop = ((top - deskRect.top) * 100) / viewZoomPercent

      console.debug("openLauncherMenu", {
        left,
        top,
        relativeLeft,
        relativeTop,
      })

      const newLauncherMenu: LauncherMenuData = {
        menuId: generateRandomId(4),
        position: {
          // left: Math.min(maxLeft, Math.max(left, minLeft)),
          // top: Math.min(maxTop, Math.max(top, minTop)),
          left: relativeLeft,
          top: relativeTop,
        },
        isFullyOpen: false,
      }
      setLauncherMenus([
        ...launcherMenus.slice(
          launcherMenus.length - config.ALLOW_MAX_LAUNCHER_MENUS + 1
        ),
        newLauncherMenu,
      ])
    },
    [
      config.ALLOW_MAX_LAUNCHER_MENUS,
      config.BASE_FONT_SIZE,
      config.LAUNCHER_MENU_SAFETY_MARGIN_REM,
      config.VIEWPORT_HEIGHT,
      config.VIEWPORT_WIDTH,
      launcherMenus,
      viewZoomPercent,
    ]
  )

  const closeLauncherMenu = useCallback(
    ({ menuId }: CloseLauncherMenuArgs) => {
      setLauncherMenus(launcherMenus.filter(menu => menu.menuId !== menuId))
    },
    [launcherMenus]
  )

  const handleLauncherMenuFullyOpen = useCallback(
    (menuId: LauncherMenuId) => {
      const newLauncherMenus = [...launcherMenus]
      const targetMenu: LauncherMenuData = _.find(
        newLauncherMenus,
        menu => menu.menuId === menuId
      )
      targetMenu.isFullyOpen = true
      setLauncherMenus(newLauncherMenus)
    },
    [launcherMenus]
  )

  const handleDeskClick = useCallback(
    event => {
      if (event.target === deskRef.current) {
        const newLauncherMenus = launcherMenus.filter(menu => !menu.isFullyOpen)
        if (newLauncherMenus.length !== launcherMenus.length) {
          setLauncherMenus(newLauncherMenus)
        }
      }
    },
    [launcherMenus]
  )

  const handleDeskTap = useCallback(
    event => {
      if (event.target === deskRef.current) {
        deactivateAllFrames()
      }
    },
    [deactivateAllFrames]
  )

  const handleDeskHold = useCallback(
    event => {
      const position = { left: event.x, top: event.y }
      if (event.target === deskRef.current) {
        if (!isAnyLauncherNearby(position, launcherMenus)) {
          openLauncherMenu(position)
        } else {
          // todo any feedback to the user that the launcher couldn't have been opened?
        }
      }
    },
    [launcherMenus, openLauncherMenu]
  )

  useEffect(() => {
    const refElement = deskRef.current
    interact((deskRef.current as unknown) as Target).unset()
    interact((deskRef.current as unknown) as Target)
      .pointerEvents({
        holdDuration: config.TOUCH_HOLD_DURATION_MS,
      })
      .on("hold", handleDeskHold)
      .on("tap", handleDeskTap)
    return () => {
      interact(refElement ?? ((refElement as unknown) as Target)).unset()
    }
  }, [config.TOUCH_HOLD_DURATION_MS, handleDeskHold, handleDeskTap])

  const frames = useMemo(() => {
    const sortedFrames = [...scene.frameStack]
    sortedFrames.sort()
    return sortedFrames.map(frameId => {
      const frame = scene.frames[frameId]
      const stackIndex = 100 + scene.frameStack.indexOf(frameId)
      return (
        frame && (
          <Frame
            frame={frame}
            key={frameId}
            frameId={frameId}
            stackIndex={stackIndex}
          />
        )
      )
    })
  }, [scene])

  return (
    <Box
      ref={deskRef}
      onClick={handleDeskClick}
      className={"Desk"}
      sx={[
        theme => ({
          background: `linear-gradient(
          23.4deg,
          var(--medium-electric-blue) 0%,
          var(--blue-brain-dark-blue) 100%)`,
          width: `${meta.viewport.width}px`,
          height: `${meta.viewport.height}px`,
          contain: `content`,
          overflow: `hidden`,
          position: `absolute`,
        }),
      ]}
    >
      <DeskBranding />

      <VersionLabel />

      {frames}

      {launcherMenus.map(launcherMenu => {
        return (
          <Box
            key={launcherMenu.menuId}
            style={{
              position: "absolute",
              left: `${launcherMenu.position.left}px`,
              top: `${launcherMenu.position.top}px`,
              zIndex: 9999,
            }}
          >
            <LauncherMenu
              menuId={launcherMenu.menuId}
              position={launcherMenu.position}
              onClose={closeLauncherMenu}
              onFullyOpen={handleLauncherMenuFullyOpen}
            />
          </Box>
        )
      })}

      <FullscreenLayer />
    </Box>
  )
}

export default Desk
