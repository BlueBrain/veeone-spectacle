import React, { FC, useCallback, useState } from "react"
import {
  Box,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
  Typography,
} from "@mui/material"
import { useSpectacle } from "../../spectacle/SpectacleStateContext"
import {
  DeleteRounded,
  Menu as MenuIcon,
  PlayArrowRounded,
  SkipNextRounded,
  SkipPreviousRounded,
} from "@mui/icons-material"
import { SceneId } from "../../types"
import { useScenes } from "../SceneContext"

interface SceneCarouselItemToolbarProps {
  sceneId: SceneId
  index: number
}

const SceneCarouselItemToolbar: FC<SceneCarouselItemToolbarProps> = ({
  sceneId,
  index,
}) => {
  const { presentationStore } = useSpectacle()

  const {
    activeSceneIndex,
    sceneIds,
    removeScene,
    moveSceneRight,
    moveSceneLeft,
    moveSceneToEnd,
    moveSceneToBeginning,
  } = useScenes()

  const viewport = presentationStore.meta.viewport
  const [
    viewTypeAnchorElement,
    setViewTypeAnchorElement,
  ] = useState<null | HTMLElement>(null)

  const openMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    setViewTypeAnchorElement(event.currentTarget)
  }

  const closeMenu = () => {
    setViewTypeAnchorElement(null)
  }

  const handleRemoveScene = useCallback(() => {
    closeMenu()
    removeScene({ sceneId })
  }, [removeScene, sceneId])

  const handleMoveSceneLeft = useCallback(() => {
    closeMenu()
    moveSceneLeft({ sceneId })
  }, [moveSceneLeft, sceneId])

  const handleMoveSceneToBeginning = useCallback(() => {
    closeMenu()
    moveSceneToBeginning({ sceneId })
  }, [moveSceneToBeginning, sceneId])

  const handleMoveSceneToEnd = useCallback(() => {
    closeMenu()
    moveSceneToEnd({ sceneId })
  }, [moveSceneToEnd, sceneId])

  const handleMoveSceneRight = useCallback(() => {
    closeMenu()
    moveSceneRight({ sceneId })
  }, [moveSceneRight, sceneId])

  return (
    <Box
      sx={{
        width: "40%",
        top: "50%",
        left: "50%",
        transition: `transform ease 1000ms`,
        transform: `
        translate(-50%)
        translateX(${-(activeSceneIndex - index) * viewport.width}px)
        `,
        position: "absolute",
        display: "flex",
      }}
    >
      <Box
        sx={{
          width: "100%",
          boxSizing: "border-box",
          padding: "2rem 2rem 0 2rem",
          fontWeight: 300,
          textAlign: "center",
          color: `rgba(255, 255, 255, .5)`,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Tooltip title="Show options">
          <span>
            <IconButton
              onClick={openMenu}
              sx={{ color: `rgba(255, 255, 255, .3)` }}
            >
              <MenuIcon />
            </IconButton>
          </span>
        </Tooltip>
        <Menu
          id="sceneOptions"
          anchorEl={viewTypeAnchorElement}
          open={Boolean(viewTypeAnchorElement)}
          onClose={closeMenu}
        >
          {index > 0 ? (
            <MenuItem onClick={handleMoveSceneToBeginning}>
              <SkipPreviousRounded />
              <Typography>Move to the beginning</Typography>
            </MenuItem>
          ) : null}
          {index > 0 ? (
            <MenuItem onClick={handleMoveSceneLeft}>
              <PlayArrowRounded sx={{ transform: "scale(-1,-1)" }} />
              <Typography>Move left</Typography>
            </MenuItem>
          ) : null}
          {index + 1 < sceneIds.length ? (
            <MenuItem onClick={handleMoveSceneRight}>
              <PlayArrowRounded />
              <Typography>Move right</Typography>
            </MenuItem>
          ) : null}
          {index + 1 < sceneIds.length ? (
            <MenuItem onClick={handleMoveSceneToEnd}>
              <SkipNextRounded />
              <Typography>Move to the end</Typography>
            </MenuItem>
          ) : null}
          <Divider />
          <MenuItem onClick={handleRemoveScene}>
            <DeleteRounded />
            <Typography>Delete scene</Typography>
          </MenuItem>
        </Menu>

        <Box sx={{ fontSize: "3rem" }}>{index + 1}</Box>
      </Box>
    </Box>
  )
}

export default SceneCarouselItemToolbar
