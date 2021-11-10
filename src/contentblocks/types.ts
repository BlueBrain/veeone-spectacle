import { FrameId } from "../core/scenes/interfaces"
import { Json } from "../common/types"

export enum ContentBlockTypes {
  Dummy = "dummy",
  Image = "image",
  Video = "video",
  SampleVideo = "samplevideo",
  Vimeo = "vimeo",
  FileBrowser = "filebrowser",
}

export interface ContentBlockProps {
  frameId: FrameId
  contentData: { [key: string]: Json } | any
}
