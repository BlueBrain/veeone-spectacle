import * as React from "react"

import * as styles from "./Desk.module.scss"
import Frame from "./Frame"
import { FrameData, LauncherMenuData, PresentationStateData } from "../presentations/interfaces"
import LauncherMenu from "./LauncherMenu"
import { connect } from "react-redux"
import { getFrames, getLauncherMenus } from "../redux/selectors"
import { closeLauncherMenu } from "../redux/actions"

interface StateProps {
  frames: Record<string, FrameData>
  launcherMenus: LauncherMenuData[]
}

interface DeskProps {
  getRef(): HTMLElement
}

type Props = DeskProps & StateProps

const Desk: React.FC<Props> = (props: Props) => {
  return (
    <div className={styles.Desk} ref={props.getRef}>
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
}), { closeLauncherMenu })(Desk)
