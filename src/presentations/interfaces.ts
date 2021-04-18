import { FrameSituation, Position } from "../common/types"

export interface FrameData {
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
  launcherMenus: LauncherMenuData[]
}
