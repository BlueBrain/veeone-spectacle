import * as React from "react"
import { useCallback, useEffect, useRef, useState } from "react"
import { Frame } from "../frames"
import { LauncherMenu } from "../../launchermenu"
import { useSelector } from "react-redux"
import { getFrames, getFrameStack } from "../redux/selectors"
import interact from "interactjs"
import { Target } from "@interactjs/types"
import { Position } from "../../common/types"
import { LauncherMenuData } from "./types"
import { generateRandomId } from "../../common/random"
import { config } from "../../config"
import { CloseLauncherMenuArgs } from "../../launchermenu/LauncherMenu"
import { DeskBranding } from "./DeskBranding"
import { Box } from "@mui/material"
import SavePresentationModal from "../../presentation-loader/SavePresentationModal"
import LoadPresentationModal from "../../presentation-loader/LoadPresentationModal"
import { useSpectacle } from "../spectacle/SpectacleContext"

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
  const deskRef = useRef()
  const frames = useSelector(getFrames)
  const frameStack = useSelector(getFrameStack)
  const [launcherMenus, setLauncherMenus] = useState<LauncherMenuData[]>([])

  const openLauncherMenu = useCallback(
    ({ top, left }: Position) => {
      const launcherWidthRem = 28
      const baseFontSize = 16
      const minLeft = (launcherWidthRem / 2) * baseFontSize
      const minTop = 4 * baseFontSize
      const maxTop = config.VIEWPORT_HEIGHT - minTop
      const maxLeft = config.VIEWPORT_WIDTH - minLeft
      const newLauncherMenu = {
        menuId: generateRandomId(4),
        position: {
          left: Math.min(maxLeft, Math.max(left, minLeft)),
          top: Math.min(maxTop, Math.max(top, minTop)),
        },
      }
      setLauncherMenus([
        ...launcherMenus.slice(
          launcherMenus.length - config.ALLOW_MAX_LAUNCHER_MENUS + 1
        ),
        newLauncherMenu,
      ])
    },
    [launcherMenus]
  )

  const closeLauncherMenu = ({ menuId }: CloseLauncherMenuArgs) => {
    setLauncherMenus(launcherMenus.filter(menu => menu.menuId !== menuId))
  }

  const handleHold = useCallback(
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
        holdDuration: 400,
      })
      .on("hold", handleHold)
    return () => {
      interact(refElement ?? ((refElement as unknown) as Target)).unset()
    }
  }, [handleHold])

  const getStackIndex = useCallback(frameId => frameStack.indexOf(frameId), [
    frameStack,
  ])

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
          width: `100%`,
          height: `100%`,
          contain: `content`,
          overflow: `hidden`,
          position: `absolute`,
        }),
      ]}
    >
      <DeskBranding />
      {Object.keys(frames).map(frameId => {
        const frame = frames[frameId]
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
      })}

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
            />
          </Box>
        )
      })}

      {spectacleContext.savePresentation.isModalOpen ? (
        <SavePresentationModal />
      ) : null}

      {spectacleContext.loadPresentation.isModalOpen ? (
        <LoadPresentationModal />
      ) : null}
    </Box>
  )
}

export default Desk
