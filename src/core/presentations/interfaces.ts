import { Position } from "../types"
import { ContentBlockTypes } from "../../contentblocks/types"
import { Json } from "../../veedrive/types"

export type FrameId = string

export type FrameStack = FrameId[]

export interface FrameData {
  [key: string]: Json
}

export interface FrameEntry {
  type: ContentBlockTypes
  situation: FrameSituation
  data: FrameData
}

export interface FramesRegister {
  [key: string]: FrameEntry
}

export interface LauncherMenuData {
  menuId: string
  position: Position
}

export interface PresentationStateData {
  frames: FramesRegister
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
