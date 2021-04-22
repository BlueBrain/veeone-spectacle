import { FrameSituation, Position } from "../types"
import { ContentBlockTypes } from "../../ContentBlocks/register"

export interface FrameData {
  type: ContentBlockTypes
  situation: FrameSituation
}

// export interface FramesData {
//   [key: string]: FrameData
// }
export type FramesData = Map<string, FrameData>

export interface LauncherMenuData {
  menuId: string
  position: Position
}

export interface PresentationStateData {
  frames: FramesData
  launcherMenus: LauncherMenuData[]
}
