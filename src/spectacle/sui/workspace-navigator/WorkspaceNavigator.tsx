import { Box } from "@mui/material"
import React, { useEffect, useMemo, useState } from "react"
import { useConfig } from "../../../config/AppConfigContext"
import { Position, Size } from "../../../common/types"
import { useSpectacle } from "../../SpectacleStateContext"
import { useSpectacleUserInterface } from "../SpectacleUserInterfaceContextProvider"

function getVisiblePartOfDiv(div: HTMLDivElement) {
  const rect = div.getBoundingClientRect()
  console.debug("getVisiblePartOfDiv", rect)

  // Viewport dimensions
  const viewportWidth =
    window.innerWidth || document.documentElement.clientWidth
  const viewportHeight =
    window.innerHeight || document.documentElement.clientHeight

  // Calculate the visible part of the div
  const visibleX = Math.max(0, rect.left)
  const visibleY = Math.max(0, rect.top)
  const visibleWidth = Math.min(viewportWidth, rect.right) - visibleX
  const visibleHeight = Math.min(viewportHeight, rect.bottom) - visibleY

  return {
    x: rect.x,
    y: rect.y,
    width: visibleWidth,
    height: visibleHeight,
  }
}

const NAV_HEIGHT = 200

const WorkspaceNavigator: React.FC = () => {
  const config = useConfig()
  const { viewZoomPercent, deskRef } = useSpectacle()
  const { targetEnvironmentConfig } = useSpectacleUserInterface()
  const [previewBoxSize, setPreviewBoxSize] = useState<Size>({
    width: 0,
    height: 0,
  })
  const [previewBoxPosition, setPreviewBoxPosition] = useState<Position>({
    left: 0,
    top: 0,
  })

  const dimensions = useMemo<Size>(() => {
    const aspect =
      targetEnvironmentConfig.pxWidth / targetEnvironmentConfig.pxHeight
    return { width: NAV_HEIGHT * aspect, height: NAV_HEIGHT }
  }, [targetEnvironmentConfig.pxHeight, targetEnvironmentConfig.pxWidth])

  useEffect(() => {
    if (deskRef.current === null) {
      return
    }
    const visibleDeskRect = getVisiblePartOfDiv(
      deskRef.current as HTMLDivElement
    )
    const percentWidth = visibleDeskRect.width / targetEnvironmentConfig.pxWidth
    const percentHeight =
      visibleDeskRect.height / targetEnvironmentConfig.pxHeight
    const size: Size = {
      width: (dimensions.width * percentWidth * 100) / viewZoomPercent,
      height: (dimensions.height * percentHeight * 100) / viewZoomPercent,
    }

    const position: Position = {
      left:
        (((dimensions.width * -Math.min(0, visibleDeskRect.x)) /
          targetEnvironmentConfig.pxWidth) *
          100) /
        viewZoomPercent,
      top:
        (((dimensions.height * -Math.min(0, visibleDeskRect.y)) /
          targetEnvironmentConfig.pxHeight) *
          100) /
        viewZoomPercent,
    }

    console.debug(
      "viewportDimensions",
      {
        targetEnvironmentConfig,
        visibleDeskRect,
        size,
      },
      position
    )
    setPreviewBoxSize(size)
    setPreviewBoxPosition(position)
  }, [
    deskRef,
    dimensions.height,
    dimensions.width,
    targetEnvironmentConfig,
    viewZoomPercent,
    setPreviewBoxSize,
    setPreviewBoxPosition,
  ])

  return (
    <Box
      sx={{
        position: "absolute",
        background: `rgba(0,0,0,.6)`,
        width: `${dimensions.width}px`,
        height: `${dimensions.height}px`,
        opacity: 0.8,
        right: 0,
        top: 0,
      }}
    >
      <Box
        sx={{
          position: "absolute",
          border: "1px red solid",
          width: `${previewBoxSize.width}px`,
          height: `${previewBoxSize.height}px`,
          top: `${previewBoxPosition.top}px`,
          left: `${previewBoxPosition.left}px`,
        }}
      />
    </Box>
  )
}

export default WorkspaceNavigator