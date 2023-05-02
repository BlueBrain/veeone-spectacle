import { Box } from "@mui/material"
import React, { useMemo } from "react"
import { useSpectacle } from "../SpectacleStateContext"
import { useSpectacleUserInterface } from "./SpectacleUserInterfaceContextProvider"
import ENVIRONMENT_CONFIGS from "../../config/environmentConfigs"

const GRID_BORDER = "0.3rem solid #000"
const GRID_OPACITY = 0.8

const ScreenGridOverlay: React.FC = () => {
  const { presentationStore } = useSpectacle()
  const { isGridVisible } = useSpectacleUserInterface()

  const targetConfig = useMemo(
    () => ({
      ...ENVIRONMENT_CONFIGS[presentationStore.targetEnvironment],
    }),
    [presentationStore.targetEnvironment]
  )

  const gridBoxes = useMemo(() => {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          flexGrow: 1,
          justifyContent: "stretch",
        }}
      >
        {Array.from({ length: targetConfig.gridRows }).map((value, i) => (
          <Box
            key={i}
            sx={{
              display: "flex",
              flexDirection: "row",
              flexGrow: 1,
            }}
          >
            {Array.from({ length: targetConfig.gridCols }).map((value, j) => (
              <Box
                key={`${i}_${j}`}
                sx={{
                  border: GRID_BORDER,
                  boxSizing: "border-box",
                  display: "flex",
                  flexGrow: "1",
                }}
              />
            ))}
          </Box>
        ))}
      </Box>
    )
  }, [targetConfig.gridRows, targetConfig.gridCols])

  return (
    <Box
      sx={{
        position: "absolute",
        width: `${presentationStore.meta.viewport.width}px`,
        height: `${presentationStore.meta.viewport.height}px`,
        left: "50%",
        top: "50%",
        transform: "translate(-50%, -50%)",
        border: GRID_BORDER,
        boxSizing: "content-box",
        pointerEvents: "none",
        display: "flex",
        flexDirection: "column",
        flexGrow: 1,
        opacity: isGridVisible ? GRID_OPACITY : 0,
        transition: "opacity ease 500ms",
      }}
    >
      {gridBoxes}
    </Box>
  )
}

export default ScreenGridOverlay
