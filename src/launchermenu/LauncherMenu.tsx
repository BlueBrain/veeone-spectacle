import React, { useCallback, useEffect, useRef } from "react"
import { Position } from "../common/types"
import { useDispatch } from "react-redux"
import { addFrame, closeLauncherMenu } from "../core/redux/actions"
import LauncherPrimaryMenu from "./LauncherPrimaryMenu"
import { LauncherMenuAction } from "./launcher-menu-actions"
import { ContentBlockTypes } from "../contentblocks/types"
import { generateFrameId } from "../core/frames/utils"
import { config } from "../config"
import { styled } from "@mui/material/styles"
import interact from "interactjs"

interface LauncherMenuProps {
  menuId: string
  position: Position
}

const StyledLauncherMenuWrapper = styled("div")`
  padding: 5rem 5rem;
  position: absolute;
  transform: translate(-50%, -50%);
  width: 28rem;
  box-sizing: content-box;
  z-index: 9999;
`

const StyledLauncherMenu = styled("div")`
  display: flex;
  flex-direction: column;
  overflow: visible;
  padding: 1rem 1rem;
`

const StyledLauncherMenuBackground = styled("div")(
  ({ theme }) => `
  position: absolute;
  box-sizing: content-box;
  overflow: visible;
  width: 100%;
  height: 100%;
  display: flex;
  flex: 1;
  left: 0;
  top: 0;
`
)

const LauncherMenu: React.FC<LauncherMenuProps> = ({ menuId, position }) => {
  const mainRef = useRef()
  const dispatch = useDispatch()

  const close = useCallback(() => {
    dispatch(closeLauncherMenu({ menuId }))
  }, [dispatch, menuId])

  useEffect(() => {
    interact(mainRef.current).on("doubletap", () => {
      close()
    })
  }, [close, dispatch, menuId])

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
          size: {
            width: config.FILE_BROWSER_WIDTH,
            height: config.FILE_BROWSER_HEIGHT,
          },
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
    <StyledLauncherMenuWrapper ref={mainRef}>
      <StyledLauncherMenu>
        <StyledLauncherMenuBackground />
        <LauncherPrimaryMenu onActionSelected={handleAction} />
      </StyledLauncherMenu>
    </StyledLauncherMenuWrapper>
  )
}

export default LauncherMenu
