import * as React from "react"
import { useEffect, useRef } from "react"

import * as styles from "./Desk.module.scss"
import Frame from "./Frame"
import { FrameData, LauncherMenuData, PresentationStateData } from "../../presentations/interfaces"
import LauncherMenu from "./LauncherMenu"
import { connect } from "react-redux"
import { getFrames, getLauncherMenus } from "../../redux/selectors"
import { closeLauncherMenu, openLauncherMenu } from "../../redux/actions"
import interact from "interactjs"
import { Target } from "@interactjs/types/index"

interface DispatchProps {
  closeLauncherMenu
  openLauncherMenu
}

interface StateProps {
  frames: Record<string, FrameData>
  launcherMenus: LauncherMenuData[]
}

interface DeskProps {
}

type Props = DeskProps & DispatchProps & StateProps

const Desk: React.FC<Props> = (props: Props) => {
  const refObject = useRef()

  const handleHold = (event) => {
    console.debug("Holding...", event)
    props.openLauncherMenu({ position: { left: event.x, top: event.y } })
  }

  useEffect(() => {
    const refElement = refObject.current
    interact(refObject.current as unknown as Target).on('hold', handleHold)
    return () => {
      interact(refObject.current ?? refElement as unknown as Target).unset()
    }
  }, [])

  return (
    <div className={styles.Desk}
         ref={refObject}>
      {Object.keys(props.frames).map((frameId) => {
          const frame = props.frames[frameId]
          return typeof frame !== "undefined" ? <Frame key={frameId} frameId={frameId}/> : ``
        }
      )}
      {props.launcherMenus.map((launcherMenu) => {
        return <div
          key={launcherMenu.menuId}
          style={{
            position: "absolute",
            left: `${launcherMenu.position.left}px`,
            top: `${launcherMenu.position.top}px`,
          }}>
          <LauncherMenu
            menuId={launcherMenu.menuId}
            position={launcherMenu.position}/>
        </div>
      })}
    </div>
  )
}

export default connect((state: PresentationStateData) => ({
  frames: getFrames(state),
  launcherMenus: getLauncherMenus(state),
}), { closeLauncherMenu, openLauncherMenu })(Desk)
