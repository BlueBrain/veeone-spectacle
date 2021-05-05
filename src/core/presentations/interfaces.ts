import { Position } from "../types"
import { ContentBlockTypes } from "../../contentblocks/register"

export type FrameId = string

export type FrameStack = FrameId[]

export interface FrameData {
  type: ContentBlockTypes
  situation: FrameSituation
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
