import * as React from "react"

import { connect } from 'react-redux'
import { addFrame, AddFramePayload, closeLauncherMenu } from '../redux/actions'
import { Position } from "../types"
import LauncherMenuItem from "./LauncherMenuItem"
import styled from "styled-components"


interface DispatchProps {
  addFrame(payload: AddFramePayload): void

  closeLauncherMenu
}

interface LauncherMenuProps {
  menuId: string
  position: Position
}

type Props = LauncherMenuProps & DispatchProps

const StyledLauncherMenu = styled.div`
  display: flex;
  flex-grow: 1;
  position: absolute;
  transform: translate(-50%, -50%);
`

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
    <StyledLauncherMenu>
      <LauncherMenuItem
        label={"Open frame"}
        onSelected={() => openFrame()}/>
      <LauncherMenuItem
        label={"Open media"}
        onSelected={() => openMedia()}/>
    </StyledLauncherMenu>
  )
}

export default connect(null, { addFrame, closeLauncherMenu })(LauncherMenu)
