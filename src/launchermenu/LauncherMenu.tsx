import React, { useCallback, useContext, useEffect, useRef } from "react"
import { Position, Size } from "../common/types"
import { useDispatch } from "react-redux"
import { addFrame } from "../core/redux/actions"
import LauncherPrimaryMenu from "./LauncherPrimaryMenu"
import { LauncherMenuAction } from "./launcher-menu-actions"
import { ContentBlockTypes } from "../contentblocks/types"
import { generateFrameId } from "../core/frames/utils"
import { config } from "../config"
import { styled } from "@mui/material/styles"
import interact from "interactjs"
import { makeFramePositionSafe } from "../core/frames/makeFramePositionSafe"
import { SpectacleContext } from "../core/spectacle/SpectacleContext"

interface LauncherMenuProps {
  menuId: string
  position: Position
  onClose: (args: CloseLauncherMenuArgs) => void
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

interface OpenNewFrameArgs {
  type: ContentBlockTypes
  size: Size
}

export interface CloseLauncherMenuArgs {
  menuId: string
}

const LauncherMenu: React.FC<LauncherMenuProps> = ({
  menuId,
  position,
  onClose,
}) => {
  const mainRef = useRef()
  const dispatch = useDispatch()
  const spectacleContext = useContext(SpectacleContext)

  const close = useCallback(() => {
    onClose({ menuId })
  }, [menuId, onClose])

  useEffect(() => {
    interact(mainRef.current).on("doubletap", () => {
      close()
    })
  }, [close, dispatch, menuId])

  const openNewFrameFromLauncher = ({ type, size }: OpenNewFrameArgs) => {
    close()
    position = makeFramePositionSafe(position, size)

    dispatch(
      addFrame({
        frameId: generateFrameId(),
        position,
        size,
        type,
        contentData: null,
      })
    )
  }

  const handleAction = (action: LauncherMenuAction) => {
    switch (action) {
      case LauncherMenuAction.OpenMedia: {
        openNewFrameFromLauncher({
          type: ContentBlockTypes.FileBrowser,
          size: {
            width: config.FILE_BROWSER_WIDTH,
            height: config.FILE_BROWSER_HEIGHT,
          },
        })
        break
      }
      case LauncherMenuAction.OpenImage: {
        openNewFrameFromLauncher({
          type: ContentBlockTypes.Image,
          size: { width: 300, height: 300 },
        })
        break
      }
      case LauncherMenuAction.OpenVideo: {
        openNewFrameFromLauncher({
          type: ContentBlockTypes.SampleVideo,
          size: { width: 800, height: 400 },
        })
        break
      }
      case LauncherMenuAction.SavePresentation: {
        spectacleContext.savePresentation.openModal({
          position: { ...position },
        })
        close()
        break
      }
      case LauncherMenuAction.LoadPresentation: {
        spectacleContext.loadPresentation.openModal({
          position: { ...position },
        })
        close()
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
