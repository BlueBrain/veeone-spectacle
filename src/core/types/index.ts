import { FramesRegister, FrameStack } from "../scenes/interfaces"

export interface SpectacleScene {
  frames: FramesRegister
  frameStack: FrameStack
}

export interface SpectacleSceneRegistry {
  [key: string]: SpectacleScene
}

export interface SpectacleScenes {
  activeSceneKey: string
  sceneOrder: string[]
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
  name: string
  createdAt: number
  updatedAt: number
  meta: SpectaclePresentationMeta
  scenes: SpectacleScenes
}
