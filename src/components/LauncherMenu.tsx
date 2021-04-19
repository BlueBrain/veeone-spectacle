import * as React from "react"

import * as styles from "./LauncherMenu.module.scss"
import { connect } from 'react-redux'
import { addFrame, AddFramePayload, closeLauncherMenu } from '../redux/actions'
import { Position } from "../common/types"
import LauncherMenuItem from "./LauncherMenuItem"


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
    props.addFrame({ position: props.position })
  }

  const openMedia = () => {
    close()
  }

  return (
    <div className={styles.LauncherMenu}>
      <LauncherMenuItem
        label={"Open frame"}
        onSelected={() => openFrame()}/>
      <LauncherMenuItem
        label={"Open media"}
        onSelected={() => openMedia()}/>
    </div>
  )
}

export default connect(null, { addFrame, closeLauncherMenu })(LauncherMenu)
