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
      {Object.keys(props.presentationData.frames).map((key) => {
        const frame = props.presentationData.frames[key]
          return <Frame key={key}
                        initialSituation={frame.situation}/>
        }
      )}
      {/*<Frame initialSituation={{ left: 100, top: 200, width: 300, height: 100, angle: 0, scale: 1 }}/>*/}
      {/*<Frame initialSituation={{ left: 600, top: 200, width: 100, height: 100, angle: 0, scale: 1 }}/>*/}
      {/*<Frame initialSituation={{ left: 300, top: 600, width: 300, height: 200, angle: 0, scale: 1 }}/>*/}
      {/*<Frame initialSituation={{ left: 400, top: 50, width: 120, height: 120, angle: 0, scale: 1 }}/>*/}
      {/*<Frame initialSituation={{ left: 500, top: 500, width: 200, height: 200, angle: 45, scale: 1 }}/>*/}

      {/*<LauncherMenu/>*/}
    </div>
  )
}

export default Desk
