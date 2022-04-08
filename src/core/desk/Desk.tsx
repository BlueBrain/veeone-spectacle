import * as React from "react"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { Frame } from "../frames"
import { LauncherMenu } from "../../launchermenu"
import interact from "interactjs"
import { Target } from "@interactjs/types"
import { Position } from "../../common/types"
import { generateRandomId } from "../../common/random"
import { CloseLauncherMenuArgs } from "../../launchermenu/LauncherMenu"
import { DeskBranding } from "./DeskBranding"
import { Box } from "@mui/material"
import { useSpectacle } from "../spectacle/SpectacleContext"
import { useDesk } from "./DeskContext"
import { useConfig } from "../../config/AppConfigContext"
import { LauncherMenuData, LauncherMenuId } from "../../launchermenu/types"
import _ from "lodash"

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
  const spectacleContext = useSpectacle()
  const meta = spectacleContext.presentationStore.meta
  const [launcherMenus, setLauncherMenus] = useState<LauncherMenuData[]>([])

  const openLauncherMenu = useCallback(
    ({ top, left }: Position) => {
      const launcherWidthRem = 28
      const baseFontSize = 16
      const minLeft = (launcherWidthRem / 2) * baseFontSize
      const minTop = 4 * baseFontSize
      const maxTop = config.VIEWPORT_HEIGHT - minTop
      const maxLeft = config.VIEWPORT_WIDTH - minLeft
      const newLauncherMenu: LauncherMenuData = {
        menuId: generateRandomId(4),
        position: {
          left: Math.min(maxLeft, Math.max(left, minLeft)),
          top: Math.min(maxTop, Math.max(top, minTop)),
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
      config.VIEWPORT_HEIGHT,
      config.VIEWPORT_WIDTH,
      launcherMenus,
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
      console.debug("handleLauncherMenuFullyOpen", menuId)
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

  const handleDeskTap = useCallback(
    event => {
      const newLauncherMenus = launcherMenus.filter(menu => !menu.isFullyOpen)
      if (newLauncherMenus.length !== launcherMenus.length) {
        setLauncherMenus(newLauncherMenus)
      }
    },
    [launcherMenus]
  )

  const handleDeskHold = useCallback(
    event => {
      const position = { left: event.x, top: event.y }
      if (event.target === deskRef.current) {
        console.debug("Holding...", event)
        if (!isAnyLauncherNearby(position, launcherMenus)) {
          openLauncherMenu(position)
        } else {
          // todo any feedback to the user that the launcher couldn't have been opened?
          console.debug("Too close to other launcher menus. Not opening.")
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
        holdDuration: 200,
      })
      .on("hold", handleDeskHold)
      .on("tap", handleDeskTap)
    return () => {
      interact(refElement ?? ((refElement as unknown) as Target)).unset()
    }
  }, [handleDeskHold, handleDeskTap])

  const getStackIndex = useCallback(
    frameId => scene.frameStack.indexOf(frameId),
    [scene.frameStack]
  )

  const frames = useMemo(() => {
    return scene.frameStack.map(frameId => {
      console.debug("render framestack", frameId)
      const frame = scene.frames[frameId]
      return typeof frame !== "undefined" ? (
        <Frame
          frame={frame}
          key={frameId}
          frameId={frameId}
          stackIndex={getStackIndex(frameId)}
        />
      ) : (
        ``
      )
    })
  }, [getStackIndex, scene.frameStack, scene.frames])

  return (
    <Box
      ref={deskRef}
      className={"Desk"}
      sx={[
        theme => ({
          background: `radial-gradient(
          circle,
          ${theme.palette.background.light} 0%,
          ${theme.palette.background.default} 80%)`,
          width: `${meta.viewport.width}px`,
          height: `${meta.viewport.height}px`,
          contain: `content`,
          overflow: `hidden`,
          position: `absolute`,
        }),
      ]}
    >
      <DeskBranding />
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
    </Box>
  )
}

export default Desk
