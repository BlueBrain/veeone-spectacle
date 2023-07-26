import { useCallback, useMemo, useRef } from "react"
import { debounce } from "lodash"
import { Situation } from "../common/types"
import interact from "interactjs"
import { FrameSituation, FrameSituationUpdate } from "../types"
import { GestureEvent } from "@interactjs/types"
import { useConfig } from "../config/AppConfigContext"
import { ApplicationConfig, RunningEnvironment } from "../config/types"

interface UseInteractJsProps {
  angle
  width
  height
  left
  top
  isMovingAllowed
  isResizingAllowed
  isResizingWithWheelAllowed
  isFullscreenAllowed
  bringToFront
  manipulate: (newSituation: FrameSituationUpdate) => void
  toggleFullscreen
  viewZoomPercent: number
}

function isOnDisplayWall(config: ApplicationConfig) {
  return [
    RunningEnvironment.SIXTH_FLOOR_DISPLAY_WALL,
    RunningEnvironment.FIFTH_FLOOR_DISPLAY_WALL,
    RunningEnvironment.OPENDECK,
    RunningEnvironment.THIRD_FLOOR_RIGHT_DISPLAY,
    RunningEnvironment.THIRD_FLOOR_LEFT_DISPLAY,
  ].includes(config.RUNNING_ENVIRONMENT)
}

export const useInteractiveFrame = ({
  angle,
  width,
  height,
  left,
  top,
  isMovingAllowed,
  isResizingAllowed,
  isResizingWithWheelAllowed,
  isFullscreenAllowed,
  bringToFront,
  manipulate,
  toggleFullscreen,
  viewZoomPercent,
}: UseInteractJsProps) => {
  const config = useConfig()
  const frameRef = useRef(null)

  const debouncedManipulate = useMemo(
    () => debounce((situation: Situation) => manipulate(situation), 50),
    [manipulate]
  )

  const isFrameTooSmall = useCallback(
    (width, height) => {
      return Math.max(width, height) < config.MINIMUM_FRAME_LONG_SIDE
    },
    [config.MINIMUM_FRAME_LONG_SIDE]
  )

  const isFrameTooBig = useCallback(
    (width, height) => {
      return Math.max(width, height) > config.MAXIMUM_FRAME_LONG_SIDE
    },
    [config.MAXIMUM_FRAME_LONG_SIDE]
  )

  const debouncedResetStyle = useMemo(
    () =>
      debounce(node => {
        node.style.transform = ``
        node.style.width = ``
        node.style.height = ``
        node.style.zIndex = ``
      }, 100),
    []
  )

  const frameRefReceiver = useCallback(
    node => {
      if (frameRef.current) {
        interact(frameRef.current).unset()
      }

      if (node) {
        node.style.transform = ``
        node.style.width = ``
        node.style.height = ``
        node.style.zIndex = ``
        let nodeLeft = left
        let nodeTop = top
        let nodeWidth = width
        let nodeHeight = height
        let nodeAngle = angle
        let aspectRatio = width / height
        let fingerAngleOffset = 0
        let gesturableStart: FrameSituation
        let resizeByWidth = null
        let isFullscreenEnabled = true

        const interactiveNode = interact(node)

        // This triggers fullscreen mode for the selected frame when double tap is performed.
        interactiveNode.on("doubletap", () => {
          if (isFullscreenAllowed && isFullscreenEnabled) {
            toggleFullscreen()
          }
        })

        interactiveNode.on("tap", bringToFront)

        if (
          isResizingAllowed &&
          isResizingWithWheelAllowed &&
          config.ALLOW_SCALE_WITH_MOUSEWHEEL
        ) {
          interactiveNode.on("mousewheel", event => {
            event.preventDefault()
            event.stopPropagation()
            if (!isResizingAllowed) {
              return
            }
            if (node !== null) {
              let diffHorizontal = Math.min(
                Math.max(-200, -event.deltaY * 2),
                200
              )
              let scale = diffHorizontal / width
              let diffVertical = scale * height

              nodeWidth += diffHorizontal
              nodeHeight += diffVertical

              if (isFrameTooSmall(nodeWidth, nodeHeight)) {
                if (aspectRatio >= 1) {
                  diffHorizontal -= nodeWidth - config.MINIMUM_FRAME_LONG_SIDE
                  nodeWidth = config.MINIMUM_FRAME_LONG_SIDE
                  nodeHeight = nodeWidth / aspectRatio
                } else {
                  nodeHeight = config.MINIMUM_FRAME_LONG_SIDE
                  diffHorizontal -= nodeWidth - nodeHeight * aspectRatio
                  nodeWidth = nodeHeight * aspectRatio
                }
              } else if (
                isFrameTooBig(nodeWidth, nodeHeight) &&
                isOnDisplayWall(config)
              ) {
                if (aspectRatio >= 1) {
                  diffHorizontal -= nodeWidth - config.MAXIMUM_FRAME_LONG_SIDE
                  nodeWidth = config.MAXIMUM_FRAME_LONG_SIDE
                  nodeHeight = nodeWidth / aspectRatio
                } else {
                  nodeHeight = config.MAXIMUM_FRAME_LONG_SIDE
                  diffHorizontal -= nodeWidth - nodeHeight * aspectRatio
                  nodeWidth = nodeHeight * aspectRatio
                }
              }

              scale = diffHorizontal / nodeWidth
              diffVertical = scale * nodeHeight

              nodeLeft -= diffHorizontal / 2
              nodeTop -= diffVertical / 2

              node.style.transform = `
                      translateX(${nodeLeft}px)
                      translateY(${nodeTop}px)
                      rotate(${angle}deg)`
              node.style.width = `${nodeWidth}px`
              node.style.height = `${nodeHeight}px`
              debouncedManipulate({
                width: nodeWidth,
                height: nodeHeight,
                left: nodeLeft,
                top: nodeTop,
              })
            }
          })
        }

        interactiveNode.resizable({
          enabled: isResizingAllowed,
          edges: {
            left: true,
            right: true,
            bottom: true,
            top: true,
          },
          invert: "none",
          onmove: event => {
            const { width: rectWidth, height: rectHeight } = event.rect
            let {
              left: deltaLeft,
              top: deltaTop,
              width: deltaWidth,
            } = event.deltaRect

            if (resizeByWidth === null) {
              resizeByWidth = deltaWidth !== 0
            }

            if (resizeByWidth) {
              nodeWidth = rectWidth
              nodeHeight = nodeWidth / aspectRatio
            } else {
              nodeHeight = rectHeight
              nodeWidth = nodeHeight * aspectRatio
            }

            if (isFrameTooSmall(nodeWidth, nodeHeight)) {
              if (aspectRatio >= 1) {
                nodeWidth = config.MINIMUM_FRAME_LONG_SIDE
                nodeHeight = nodeWidth / aspectRatio
              } else {
                nodeHeight = config.MINIMUM_FRAME_LONG_SIDE
                nodeWidth = nodeHeight * aspectRatio
              }
            } else if (
              isFrameTooBig(nodeWidth, nodeHeight) &&
              isOnDisplayWall(config)
            ) {
              if (aspectRatio >= 1) {
                nodeWidth = config.MAXIMUM_FRAME_LONG_SIDE
                nodeHeight = nodeWidth / aspectRatio
              } else {
                nodeHeight = config.MAXIMUM_FRAME_LONG_SIDE
                nodeWidth = nodeHeight * aspectRatio
              }
            }

            if (event.edges.top && (event.edges.left || event.edges.right)) {
              deltaTop = -deltaWidth / aspectRatio
            }

            let nodeLongSide = Math.max(nodeWidth, nodeHeight)

            if (
              nodeLongSide <= config.MINIMUM_FRAME_LONG_SIDE ||
              nodeLongSide >= config.MAXIMUM_FRAME_LONG_SIDE
            ) {
              deltaTop = 0
              deltaLeft = 0
            }

            nodeLeft += (deltaLeft * 100) / viewZoomPercent
            nodeTop += (deltaTop * 100) / viewZoomPercent
            nodeWidth *= 100 / viewZoomPercent
            nodeHeight *= 100 / viewZoomPercent

            node.style.transform = `translateX(${nodeLeft}px) translateY(${nodeTop}px)`
            node.style.width = `${nodeWidth}px`
            node.style.height = `${nodeHeight}px`
          },
          onend: () => {
            manipulate({
              left: nodeLeft,
              top: nodeTop,
              width: nodeWidth,
              height: nodeHeight,
            })
            debouncedResetStyle(node)
          },
        })

        interactiveNode.gesturable({
          enabled: isResizingAllowed,
          onstart: event => {
            fingerAngleOffset = event.angle - angle
            gesturableStart = {
              left,
              top,
              width,
              height,
              angle,
            }
          },
          onmove: (event: GestureEvent) => {
            const desiredScale = event.scale
            const desiredWidth = gesturableStart.width * desiredScale
            const desiredHeight = gesturableStart.height * desiredScale
            let newWidth = desiredWidth
            let newHeight = desiredHeight
            let scale = desiredScale

            if (aspectRatio >= 1) {
              newWidth = Math.min(
                Math.max(newWidth, config.MINIMUM_FRAME_LONG_SIDE),
                config.MAXIMUM_FRAME_LONG_SIDE
              )
              newHeight = newWidth / aspectRatio
            } else {
              newHeight = Math.min(
                Math.max(newHeight, config.MINIMUM_FRAME_LONG_SIDE),
                config.MAXIMUM_FRAME_LONG_SIDE
              )
              newWidth = newHeight * aspectRatio
            }
            if (newWidth !== desiredWidth) {
              scale = newWidth / width
            }
            nodeWidth = newWidth
            nodeHeight = newHeight
            node.style.transform = `
              translateX(${nodeLeft}px)
              translateY(${nodeTop}px)
              scale(${scale})
              rotate(${nodeAngle}deg)`
          },
          onend: () => {
            manipulate({
              width: nodeWidth,
              height: nodeHeight,
              left: nodeLeft + (width - nodeWidth) / 2,
              top: nodeTop + (height - nodeHeight) / 2,
            })
            debouncedResetStyle(node)
          },
        })

        interactiveNode.draggable({
          enabled: isMovingAllowed,
          allowFrom: "[data-drag-handle]",
          inertia: {
            resistance: 8,
          },
          modifiers: [
            interact.modifiers.restrictRect({
              restriction: "parent",
              endOnly: true,
            }),
          ],
          onstart: () => {
            isFullscreenEnabled = false
            node.style.zIndex = "9999"
            nodeLeft = left
            nodeTop = top
          },
          onmove: event => {
            const { dx, dy } = event
            nodeLeft += dx * (100 / viewZoomPercent)
            nodeTop += dy * (100 / viewZoomPercent)
            node.style.transform = `
              translateX(${nodeLeft}px)
              translateY(${nodeTop}px)
              rotate(${angle}deg)`
            node.style.width = `${nodeWidth}px`
            node.style.height = `${nodeHeight}px`
          },
          onend: () => {
            isFullscreenEnabled = true
            bringToFront()
            manipulate({ left: nodeLeft, top: nodeTop })
            node.style.transform = ``
            node.style.width = ``
            node.style.height = ``
            node.style.zIndex = ``
          },
        })
      }
      frameRef.current = node
      return frameRef
    },
    [
      left,
      top,
      width,
      height,
      angle,
      bringToFront,
      isResizingAllowed,
      isResizingWithWheelAllowed,
      config,
      isMovingAllowed,
      isFullscreenAllowed,
      toggleFullscreen,
      isFrameTooSmall,
      isFrameTooBig,
      debouncedManipulate,
      manipulate,
      debouncedResetStyle,
      viewZoomPercent,
    ]
  )
  return [frameRefReceiver]
}
