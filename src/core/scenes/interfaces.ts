import { Json, Position } from "../../common/types"
import { ContentBlockTypes } from "../../contentblocks/types"

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

export interface SceneStateData {
  frames: FramesRegister
  frameStack: FrameStack
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

export interface SceneDataPayload {
  id: string
  state: SceneStateData
}
