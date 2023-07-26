import { Json } from "../common/types"
import { ContentBlockTypes } from "../contentblocks/types"
import { RunningEnvironment } from "../config/types"

export type FrameId = string

export type SceneId = string

export type FrameStack = FrameId[]

export interface FrameData {
  [key: string]: Json
}

export interface FrameEntry {
  type: ContentBlockTypes
  // todo size, position, angle should be considered separately
  // todo deprecate the "situation" attribute
  situation: FrameSituation
  data: FrameData
}

export interface FramesRegister {
  [key: string]: FrameEntry
}

export type FrameSituation = {
  left: number
  top: number
  width: number
  height: number
  angle: number
}

export type FrameSituationUpdate = {
  left?: number
  top?: number
  width?: number
  height?: number
  angle?: number
}

export interface SpectacleScene {
  frames: FramesRegister
  frameStack: FrameStack
}

export interface SpectacleSceneRegistry {
  [key: string]: SpectacleScene
}

export interface SpectacleScenes {
  activeScene: SceneId
  sceneOrder: SceneId[]
  scenes: SpectacleSceneRegistry
}

export interface SpectacleViewport {
  width: number
  height: number
}

export interface SpectaclePresentationMeta {
  viewport: SpectacleViewport
}

export interface SpectaclePresentation {
  id: string | null
  name: string
  targetEnvironment: RunningEnvironment | null
  folder: string | null
  createdAt: number
  updatedAt: number
  savedAt: number
  meta: SpectaclePresentationMeta
  scenes: SpectacleScenes
}
