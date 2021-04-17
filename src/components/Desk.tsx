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
  // presentationData: PresentationStateData
}


const Desk: React.FC = (props: DeskProps & StateProps) => {

  return (
    <div className={styles.Desk} ref={props.getRef}>
      {Object.keys(props.frames).map((frameId) => {
          const frame = props.frames[frameId]
          return typeof frame !== "undefined" ?
            <Frame key={frameId}
                   frameId={frameId}
                   initialSituation={frame.situation}/>
            : ``
        }
      )}
      <LauncherMenu/>
    </div>
  )
}

export default connect((state: PresentationStateData) => ({
  frames: getFrames(state),
}))(Desk)
