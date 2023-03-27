import { Box, IconButton, Tooltip } from "@mui/material"
import React, { MouseEvent, useCallback } from "react"
import {
  GridOff,
  GridOn,
  ZoomIn,
  ZoomOut,
  ZoomOutMap,
} from "@mui/icons-material"
import { useSpectacleUserInterface } from "./SpectacleUserInterfaceContextProvider"

const WorkspaceControlPanel: React.FC = () => {
  const {
    isGridVisible,
    setIsGridVisible,
    viewZoomPercent,
    setViewZoomPercent,
    workspaceSize,
    targetEnvironmentConfig,
  } = useSpectacleUserInterface()

  const onIconButtonClick = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      setIsGridVisible(!isGridVisible)
    },
    [isGridVisible]
  )

  const increaseZoom = useCallback(() => {
    setViewZoomPercent(prev => {
      console.debug("prev", prev)
      return prev < 100 ? prev + 10 - (prev % 10) : 100
    })
  }, [setViewZoomPercent])

  const decreaseZoom = useCallback(() => {
    setViewZoomPercent(prev => {
      console.debug("prev", prev)
      return prev >= 10 ? prev - 10 - (prev % 10) : 100
    })
  }, [setViewZoomPercent])

  const resetZoom = useCallback(() => {
    setViewZoomPercent(
      Math.round((100 * workspaceSize.width) / targetEnvironmentConfig.pxWidth)
    )
  }, [
    setViewZoomPercent,
    targetEnvironmentConfig?.pxWidth,
    workspaceSize.width,
  ])

  return (
    <Box
      sx={{
        background: "#1e1e1e",
        color: "white",
        position: "absolute",
        left: "50%",
        bottom: "10%",
        transform: "translateX(-50%)",
        borderRadius: "0.5rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem",
      }}
    >
      {/* todo unlock it for remote control later */}
      {/*<LiveSwitch />*/}
      {/*<Box sx={{ width: "2rem" }} />*/}

      <Box>
        <Tooltip title={"Zoom out"} onClick={decreaseZoom}>
          <IconButton>
            <ZoomOut />
          </IconButton>
        </Tooltip>
      </Box>
      <Box>{viewZoomPercent}%</Box>
      <Box>
        <IconButton onClick={resetZoom}>
          <ZoomOutMap />
        </IconButton>
      </Box>
      <Box>
        <Tooltip title={"Zoom in"} onClick={increaseZoom}>
          <IconButton>
            <ZoomIn />
          </IconButton>
        </Tooltip>
      </Box>

      <Box sx={{ width: "2rem" }} />

      <Box>
        <Tooltip title={"Display or hide individual screen bevels"}>
          <IconButton onClick={onIconButtonClick}>
            {isGridVisible ? <GridOff /> : <GridOn />}
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  )
}

export default WorkspaceControlPanel
