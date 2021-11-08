import * as React from "react"
import { useEffect, useRef } from "react"
import Frame from "../frames/Frame"
import { LauncherMenu } from "../../launchermenu"
import { useDispatch, useSelector } from "react-redux"
import { getFrames, getFrameStack, getLauncherMenus } from "../redux/selectors"
import { openLauncherMenu } from "../redux/actions"
import interact from "interactjs"
import { Target } from "@interactjs/types"
import styled from "styled-components"

interact.pointerMoveTolerance(4)

const StyledDesk = styled.div`
  background: rgb(5, 10, 86);
  background: radial-gradient(
    circle,
    rgba(3, 86, 150, 1) 0%,
    rgba(5, 10, 86, 1) 80%
  );
  width: 100%;
  height: 100%;
  contain: content;
  overflow: hidden;
`

const Desk: React.FC = () => {
  const refObject = useRef()
  const dispatch = useDispatch()
  const frames = useSelector(getFrames)
  const frameStack = useSelector(getFrameStack)
  const launcherMenus = useSelector(getLauncherMenus)

  const handleHold = event => {
    console.debug("Holding...", event)
    dispatch(openLauncherMenu({ position: { left: event.x, top: event.y } }))
  }

  useEffect(() => {
    const refElement = refObject.current
    interact((refObject.current as unknown) as Target).on("hold", handleHold)
    return () => {
      interact(refObject.current ?? ((refElement as unknown) as Target)).unset()
    }
  }, [])

  return (
    <StyledDesk ref={refObject}>
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
