import * as React from "react"

import * as styles from "./LauncherMenu.module.scss"
import { connect } from 'react-redux'
import { addFrame } from '../redux/actions'

interface DispatchProps {
  addFrame
}

interface LauncherMenuProps {
}

type Props = LauncherMenuProps & DispatchProps

const LauncherMenu = (props: Props) => {
  const openFrame = () => {
    props.addFrame()
  }

  return (
    <div className={styles.LauncherMenu} ref={props.getRef}>
      <button type={"button"} onClick={openFrame}>Open frame</button>
    </div>
  )
}

export default connect(null, { addFrame })(LauncherMenu)
