import * as React from "react"

import { connect } from 'react-redux'
import { addFrame, AddFramePayload, closeAllFrames, closeLauncherMenu } from '../redux/actions'
import { Position } from "../types"
import LauncherMenuItem from "./LauncherMenuItem"
import styled from "styled-components"
import { ContentBlockTypes } from "../../ContentBlocks/register"
import { generateRandomId } from "../../common/random"

interface DispatchProps {
  addFrame(payload: AddFramePayload): void

  closeLauncherMenu
  closeAllFrames
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
  z-index: 9999;
`
const LauncherMenu = (props: Props) => {
  const close = () => {
    props.closeLauncherMenu({ menuId: props.menuId })
  }

  const generateFrameId = () => generateRandomId(6)

  const newFrame = (payload) => {
    close()
    props.addFrame({
      frameId: generateFrameId(),
      position: props.position,
      ...payload
    })
  }

  const openFrame = () => newFrame({ type: ContentBlockTypes.Dummy })

  const openImage = () => newFrame({ type: ContentBlockTypes.SampleImage })

  const openVideo = () => newFrame({ type: ContentBlockTypes.SampleVideo })

  const openVimeo = () => newFrame({ type: ContentBlockTypes.Vimeo })

  const closeAllFrames = () => {
    close()
    props.closeAllFrames()
  }

  return (
    <StyledLauncherMenu>
      <LauncherMenuItem
        label={"Open frame"}
        onSelected={() => openFrame()}/>
      <LauncherMenuItem
        label={"Open image"}
        onSelected={() => openImage()}/>
      <LauncherMenuItem
        label={"Open video"}
        onSelected={() => openVideo()}/>
      <LauncherMenuItem
        label={"Open Vimeo movie"}
        onSelected={() => openVimeo()}/>
      <LauncherMenuItem
        label={"Cancel"}
        onSelected={close}/>
      <LauncherMenuItem
        label={"Close all"}
        onSelected={closeAllFrames}/>
    </StyledLauncherMenu>
  )
}

export default connect(null, { addFrame, closeLauncherMenu, closeAllFrames })(LauncherMenu)
