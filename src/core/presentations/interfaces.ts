import { Position } from "../types"
import { ContentBlockTypes } from "../../ContentBlocks/types"
import { Json } from "../../veedrive/types"

export type FrameId = string

export type FrameStack = FrameId[]

export type FrameDataDict = { [key: string]: Json }

export interface FrameData {
  type: ContentBlockTypes
  situation: FrameSituation
  data: FrameDataDict
}

export interface FramesData {
  [key: string]: FrameData
}

export interface LauncherMenuData {
  menuId: string
  position: Position
}

export interface PresentationStateData {
  frames: FramesData
  frameStack: FrameStack
  launcherMenus: LauncherMenuData[]
}

export type FrameSituation = {
  left: number
  top: number
  width: number
  height: number
  angle: number
  isFullscreen?: boolean
  disableWheelScaling: boolean
}

export type FrameSituationUpdate = {
  left?: number
  top?: number
  width?: number
  height?: number
  angle?: number
  isFullscreen?: boolean
}
