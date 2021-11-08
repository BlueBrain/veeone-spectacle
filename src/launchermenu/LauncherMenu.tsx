import React from "react"
import styled from "styled-components"
import { Position } from "../core/types"
import { useDispatch } from "react-redux"
import { addFrame, closeLauncherMenu } from "../core/redux/actions"
import LauncherPrimaryMenu from "./LauncherPrimaryMenu"
import LauncherPagesNavigator from "./LauncherPagesNavigator"
import { LauncherMenuAction } from "./launcher-menu-actions"
import { ContentBlockTypes } from "../contentblocks/types"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faTimes } from "@fortawesome/free-solid-svg-icons"
import { generateFrameId } from "../core/frames/utils"

interface LauncherMenuProps {
  menuId: string
  position: Position
}

const StyledCloseButton = styled.button`
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: rgba(0, 0, 0, 0.7);
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
  overflow: visible;
  padding: 1rem 1rem;
  box-shadow: 2rem 2rem 4rem rgba(0, 0, 0, 0.3),
    -2rem 2rem 4rem rgba(0, 0, 0, 0.3);
`

const StyledLauncherMenuBackground = styled.div`
  position: absolute;
  background: rgba(17, 82, 147, 0.8);
  backdrop-filter: grayscale(100%) blur(10px);
  box-sizing: content-box;
  overflow: visible;
  width: 100%;
  height: 100%;
  display: flex;
  flex: 1;
  left: 0;
  top: 0;
`

const StyledTopControls = styled.div`
  position: relative;
  margin-bottom: 1rem;
  margin-top: -2.7rem;
`

const LauncherMenu: React.FC<LauncherMenuProps> = ({
  menuId,
  position,
  children,
}) => {
  const dispatch = useDispatch()
  const close = () => {
    dispatch(closeLauncherMenu({ menuId }))
  }

  const newFrame = payload => {
    close()
    dispatch(
      addFrame({
        frameId: generateFrameId(),
        position: position,
        ...payload,
      })
    )
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
      case LauncherMenuAction.OpenImage: {
        newFrame({
          type: ContentBlockTypes.Image,
          size: { width: 400, height: 400 },
        })
        break
      }
      case LauncherMenuAction.OpenVideo: {
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

  return (
    <StyledLauncherMenu>
      <StyledLauncherMenuBackground />
      <StyledTopControls>
        <StyledCloseButton type="button" onClick={close}>
          <FontAwesomeIcon icon={faTimes} />
        </StyledCloseButton>
      </StyledTopControls>

      <LauncherPrimaryMenu onActionSelected={handleAction} />
      <LauncherPagesNavigator />
    </StyledLauncherMenu>
  )
}

export default LauncherMenu
