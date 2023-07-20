import { Box } from "@mui/material"
import React, { useEffect, useMemo, useRef, useState } from "react"
import { useConfig } from "../../../config/AppConfigContext"
import { Position, Size } from "../../../common/types"
import { useSpectacle } from "../../SpectacleStateContext"
import { useSpectacleUserInterface } from "../SpectacleUserInterfaceContextProvider"
import interact from "interactjs"

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

function determineElementPosition({
  deskDiv,
  dimensions,
  targetEnvironmentConfig,
  viewZoomPercent,
}) {
  const visibleDeskRect = getVisiblePartOfDiv(deskDiv as HTMLDivElement)

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
  return { position, size }
}

const NAV_HEIGHT = 200
const NAV_SPEED_FACTOR = 50

const WorkspaceNavigator: React.FC = () => {
  const previewBoxRef = useRef<HTMLDivElement>()
  const { viewZoomPercent, deskRef } = useSpectacle()
  const {
    targetEnvironmentConfig,
    uiRef,
    initialPosition,
    setInitialPosition,
    previewBoxPosition,
    setPreviewBoxPosition,
  } = useSpectacleUserInterface()
  const [previewBoxSize, setPreviewBoxSize] = useState<Size>({
    width: 0,
    height: 0,
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

    const { position, size } = determineElementPosition({
      deskDiv: deskRef.current,
      dimensions,
      targetEnvironmentConfig,
      viewZoomPercent,
    })

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
    dimensions,
  ])

  useEffect(() => {
    if (initialPosition === null) {
      setInitialPosition(previewBoxPosition)
    }
  }, [initialPosition, previewBoxPosition, setInitialPosition])

  useEffect(() => {
    const box = previewBoxRef.current
    const uiScreen = uiRef.current as HTMLDivElement

    if (box !== null && uiScreen !== null) {
      const uiRect = uiScreen.getBoundingClientRect()
      let x = uiRect.x
      let y = uiRect.y

      interact(box).draggable({
        onmove: event => {
          const { dx, dy } = event
          x += -NAV_SPEED_FACTOR * dx
          y += -NAV_SPEED_FACTOR * dy
          uiScreen.style.transform = `translateX(${x}px) translateY(${y}px)`

          // update the red rectangle
          const { position, size } = determineElementPosition({
            deskDiv: deskRef.current,
            dimensions,
            targetEnvironmentConfig,
            viewZoomPercent,
          })

          setPreviewBoxSize(size)
          setPreviewBoxPosition(position)
        },
      })
    }
    return () => {
      if (previewBoxRef.current) {
        interact(previewBoxRef.current).unset()
      }
    }
  }, [
    deskRef,
    dimensions,
    setPreviewBoxPosition,
    targetEnvironmentConfig,
    uiRef,
    viewZoomPercent,
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
        color: "white",
      }}
    >
      <Box
        ref={previewBoxRef}
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
