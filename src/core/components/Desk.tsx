import * as React from "react"
import { useEffect, useRef } from "react"
import Frame from "./Frame"
import {
  FrameEntry,
  FrameStack,
  LauncherMenuData,
  PresentationStateData,
} from "../presentations/interfaces"
import LauncherMenu from "./LauncherMenu"
import { connect } from "react-redux"
import { getFrames, getFrameStack, getLauncherMenus } from "../redux/selectors"
import { closeLauncherMenu, openLauncherMenu } from "../redux/actions"
import interact from "interactjs"
import { Target } from "@interactjs/types/index"
import styled from "styled-components"
import LoadSaveButtons from "./LoadSaveButtons"
import SandboxVisualKeyboard from "../../sandbox/components/SandboxVisualKeyboard/SandboxVisualKeyboard"

interact.pointerMoveTolerance(4)

interface DispatchProps {
  closeLauncherMenu
  openLauncherMenu
}

interface StateProps {
  frames: Record<string, FrameEntry>
  frameStack: FrameStack
  launcherMenus: LauncherMenuData[]
}

interface DeskProps {}

type Props = DeskProps & DispatchProps & StateProps

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

const Desk: React.FC<Props> = (props: Props) => {
  const refObject = useRef()

  const handleHold = event => {
    console.debug("Holding...", event)
    props.openLauncherMenu({ position: { left: event.x, top: event.y } })
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
      <SandboxVisualKeyboard />
      <LoadSaveButtons />
      {Object.keys(props.frames).map(frameId => {
        const frame = props.frames[frameId]
        return typeof frame !== "undefined" ? (
          <Frame
            frame={frame}
            key={frameId}
            frameId={frameId}
            stackIndex={props.frameStack.indexOf(frameId)}
          />
        ) : (
          ``
        )
      })}
      {props.launcherMenus.map(launcherMenu => {
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

export default connect(
  (state: PresentationStateData) => ({
    frames: getFrames(state),
    frameStack: getFrameStack(state),
    launcherMenus: getLauncherMenus(state),
  }),
  { closeLauncherMenu, openLauncherMenu }
)(Desk)
