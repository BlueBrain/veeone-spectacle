import * as React from "react"

import * as styles from "./Desk.module.scss"
import Frame from "./Frame"
import PresentationData from "../presentations/interfaces"

// import LauncherMenu from "./LauncherMenu"


interface DeskProps {
  presentationData: PresentationData
}


const Desk: React.FC = (props: DeskProps) => {

  return (
    <div className={styles.Desk} ref={props.getRef}>
      {Object.keys(props.presentationData.frames).map((frameId) => {
          const frame = props.presentationData.frames[frameId]
          return typeof frame !== "undefined" ?
            <Frame key={frameId}
                   initialSituation={frame.situation}/>
            : ``
        }
      )}
      {/*<LauncherMenu/>*/}
    </div>
  )
}

export default Desk
