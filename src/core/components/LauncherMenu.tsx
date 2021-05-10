import React from "react"
import styled from "styled-components"
import { Position } from "../types"
import { generateRandomId } from "../../common/random"
import { connect } from "react-redux"
import { addFrame, AddFramePayload, closeAllFrames, closeLauncherMenu } from "../redux/actions"
import LauncherPrimaryMenu from "./LauncherPrimaryMenu"
import LauncherPagesNavigator from "./LauncherPagesNavigator"
import { LauncherMenuAction } from "../launchermenu/launcher-menu-actions"
import { ContentBlockTypes } from "../../ContentBlocks/content-block-register"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faTimes } from "@fortawesome/free-solid-svg-icons"


interface LauncherMenuProps {
  menuId: string
  position: Position
}

interface DispatchProps {
  addFrame(payload: AddFramePayload): void

  closeLauncherMenu
  closeAllFrames
}

type Props = LauncherMenuProps & DispatchProps

const StyledCloseButton = styled.button`
  background: rgba(255, 255, 255, .2);
  border: none;
  color: rgba(0, 0, 0, .7);
  border-radius: 1rem;
  aspect-ratio: 1;
`

const StyledLauncherMenu = styled.div`
  position: absolute;
  transform: translate(-50%, -50%);
  width: 28rem;
  display: flex;
  flex-direction: column;
  z-index: 9999;
  overflow: hidden;
  backdrop-filter: blur(8px);
  padding: 1rem 3rem;
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

  const handleAction = (action: LauncherMenuAction) => {
    switch (action) {
      case LauncherMenuAction.OpenMedia: {
        newFrame({
          type: ContentBlockTypes.FileBrowser,
          size: { width: 700, height: 500 },
        })
        break
      }
      case LauncherMenuAction.OpenSampleImage: {
        newFrame({
          type: ContentBlockTypes.SampleImage,
          size: { width: 400, height: 400 },
        })
        break
      }
      case LauncherMenuAction.OpenSampleVideo: {
        newFrame({
          type: ContentBlockTypes.SampleVideo,
          size: { width: 800, height: 400 },
        })
        break
      }
      case LauncherMenuAction.OpenSampleVimeo: {
        newFrame({
          type: ContentBlockTypes.Vimeo,
          size: { width: 800, height: 400 },
        })
        break
      }
      default: {
        break
      }
    }
  }

  return <StyledLauncherMenu>

    <div>
      <StyledCloseButton type="button" onClick={close}>
        <FontAwesomeIcon icon={faTimes} />
      </StyledCloseButton>
    </div>

    <LauncherPrimaryMenu onActionSelected={handleAction} />
    <LauncherPagesNavigator />

  </StyledLauncherMenu>
}

export default connect(null, { addFrame, closeLauncherMenu, closeAllFrames })(LauncherMenu)
