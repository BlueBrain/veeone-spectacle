import * as React from "react"

import * as styles from "./Desk.module.scss"
import Frame from "./Frame"
import { FrameData, PresentationStateData } from "../presentations/interfaces"
import LauncherMenu from "./LauncherMenu"
import { connect } from "react-redux"
import { getFrames } from "../redux/selectors"

interface StateProps {
  frames: Record<string, FrameData>
}

interface DeskProps {
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
      <LauncherMenu/>
    </div>
  )
}

export default connect((state: PresentationStateData) => ({
  frames: getFrames(state),
}))(Desk)
