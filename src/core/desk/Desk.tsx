import * as React from "react"
import { useCallback, useEffect, useRef } from "react"
import Frame from "../frames/Frame"
import { LauncherMenu } from "../../launchermenu"
import { useDispatch, useSelector } from "react-redux"
import { getFrames, getFrameStack, getLauncherMenus } from "../redux/selectors"
import { openLauncherMenu } from "../redux/actions"
import interact from "interactjs"
import { Target } from "@interactjs/types"
import { styled } from "@mui/material/styles"

interact.pointerMoveTolerance(4)

const StyledDesk = styled(`div`)(({ theme }) => ({
  background: `radial-gradient(
          circle,
          ${theme.palette.background.light} 0%,
          ${theme.palette.background.default} 80%)`,
  width: `100%`,
  height: `100%`,
  contain: `content`,
  overflow: `hidden`,
  position: `absolute`,
}))

const Desk: React.FC = () => {
  const deskRef = useRef()
  const dispatch = useDispatch()
  const frames = useSelector(getFrames)
  const frameStack = useSelector(getFrameStack)
  const launcherMenus = useSelector(getLauncherMenus)

  const handleHold = useCallback(
    event => {
      if (event.target === deskRef.current) {
        console.debug("Holding...", event)
        dispatch(
          openLauncherMenu({ position: { left: event.x, top: event.y } })
        )
      }
    },
    [dispatch]
  )

  useEffect(() => {
    const refElement = deskRef.current
    interact((deskRef.current as unknown) as Target)
      .pointerEvents({
        holdDuration: 400,
      })
      .on("hold", handleHold)
    return () => {
      interact(refElement ?? ((refElement as unknown) as Target)).unset()
    }
  }, [handleHold])

  return (
    <StyledDesk ref={deskRef}>
      {Object.keys(frames).map(frameId => {
        const frame = frames[frameId]
        return typeof frame !== "undefined" ? (
          <Frame
            frame={frame}
            key={frameId}
            frameId={frameId}
            stackIndex={frameStack.indexOf(frameId)}
          />
        ) : (
          ``
        )
      })}
      {launcherMenus.map(launcherMenu => {
        return (
          <div
            key={launcherMenu.menuId}
            style={{
              position: "absolute",
              left: `${launcherMenu.position.left}px`,
              top: `${launcherMenu.position.top}px`,
            }}
          >
            <LauncherMenu
              menuId={launcherMenu.menuId}
              position={launcherMenu.position}
            />
          </div>
        )
      })}
    </StyledDesk>
  )
}

export default Desk
