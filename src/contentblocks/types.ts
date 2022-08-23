import { FrameId } from "../types"
import { Json } from "../common/types"

export enum ContentBlockTypes {
  Dummy = "dummy",
  Image = "image",
  Video = "video",
  SampleVideo = "samplevideo",
  Vimeo = "vimeo",
  FileBrowser = "filebrowser",
  Website = "website",
}

export interface ContentBlockProps {
  frameId: FrameId
  contentData: { [key: string]: Json } | any
}
