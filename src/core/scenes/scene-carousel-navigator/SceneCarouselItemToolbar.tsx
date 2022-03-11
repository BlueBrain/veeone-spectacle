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
import { useSpectacle } from "../../spectacle/SpectacleContext"
import {
  ArrowLeftRounded,
  ArrowRightRounded,
  DeleteRounded,
  Menu as MenuIcon,
} from "@mui/icons-material"
import { SceneId } from "../../types"

interface SceneCarouselItemToolbarProps {
  sceneId: SceneId
  index: number
}

const SceneCarouselItemToolbar: FC<SceneCarouselItemToolbarProps> = ({
  sceneId,
  index,
}) => {
  const {
    activeSceneIndex,
    presentationStore,
    sceneManager,
    sceneIds,
  } = useSpectacle()
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

  const removeScene = useCallback(() => {
    closeMenu()
    sceneManager.removeScene(sceneId)
  }, [sceneId, sceneManager])

  const moveSceneLeft = useCallback(() => {
    closeMenu()
    sceneManager.moveSceneLeft(sceneId)
  }, [sceneId, sceneManager])

  const moveSceneRight = useCallback(() => {
    closeMenu()
    sceneManager.moveSceneRight(sceneId)
  }, [sceneId, sceneManager])

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
            <MenuItem onClick={moveSceneLeft}>
              <ArrowLeftRounded />
              <Typography>Move left</Typography>
            </MenuItem>
          ) : null}
          {index + 1 < sceneIds.length ? (
            <MenuItem onClick={moveSceneRight}>
              <ArrowRightRounded />
              <Typography>Move right</Typography>
            </MenuItem>
          ) : null}
          <Divider />
          <MenuItem onClick={removeScene}>
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
