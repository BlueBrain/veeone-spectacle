import { FrameData, FrameId, FrameSituationUpdate } from "../types"
import React from "react"
import { ContentBlockTypes } from "../contentblocks/types"

export interface FrameContextProps {
  frameId: FrameId
  frameContentData: FrameData
  isTopFrame: boolean
  stackIndex: number
  width: number
  height: number
  top: number
  left: number
  angle: number
  ContentBlockComponent: React.FC | React.NamedExoticComponent
  frameType: ContentBlockTypes
  isFullscreenAllowed: boolean
  isMovingAllowed: boolean
  isResizingAllowed: boolean
  isResizingWithWheelAllowed: boolean
  manipulate: (newSituation: FrameSituationUpdate) => void
  bringToFront: (event: Event) => void

  updateAspectRatio(aspectRatio: number): void
  toggleFullscreen(): void
  preventMoving(): void
  preventResizing(): void
  preventResizingWithWheel(): void
  preventFullscreen(): void
  close(): void
  sendToBack(): void
  setFullscreenParamsProvider(handler: Function): void
}
