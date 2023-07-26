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
import { useSpectacle } from "../SpectacleStateContext"

const WorkspaceControlPanel: React.FC = () => {
  const { viewZoomPercent } = useSpectacle()
  const {
    isGridVisible,
    setIsGridVisible,
    zoomIn,
    zoomOut,
    zoomFit,
  } = useSpectacleUserInterface()

  const onIconButtonClick = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      setIsGridVisible(!isGridVisible)
    },
    [isGridVisible, setIsGridVisible]
  )

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
      <Box>
        <Tooltip title={"Zoom out"} onClick={zoomOut}>
          <IconButton>
            <ZoomOut />
          </IconButton>
        </Tooltip>
      </Box>
      <Box>{viewZoomPercent}%</Box>
      <Box>
        <IconButton onClick={zoomFit}>
          <ZoomOutMap />
        </IconButton>
      </Box>
      <Box>
        <Tooltip title={"Zoom in"} onClick={zoomIn}>
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
