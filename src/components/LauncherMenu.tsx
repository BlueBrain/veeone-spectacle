import * as React from "react"

import * as styles from "./LauncherMenu.module.scss"
import { connect } from 'react-redux'
import { addFrame, AddFramePayload, closeLauncherMenu } from '../redux/actions'
import { Position } from "../common/types"


interface DispatchProps {
  addFrame(payload: AddFramePayload): void
  closeLauncherMenu
}

interface LauncherMenuProps {
  menuId: string
  position: Position
}

type Props = LauncherMenuProps & DispatchProps

const LauncherMenu = (props: Props) => {
  const close = () => {
    props.closeLauncherMenu({ menuId: props.menuId })
  }

  const openFrame = () => {
    close()
    props.addFrame({position: props.position})
  }

  const openMedia = () => {
    close()
  }

  return (
    <div className={styles.LauncherMenu} ref={props.getRef}>
      <button type={"button"} onClick={openFrame}>Open frame</button>
      <button type={"button"} onClick={openMedia}>Open media</button>
    </div>
  )
}

export default connect(null, { addFrame, closeLauncherMenu })(LauncherMenu)
