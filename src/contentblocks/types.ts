import { FrameId } from "../core/presentations/interfaces"
import { Json } from "../veedrive/types"

export enum ContentBlockTypes {
  Dummy = "dummy",
  // SampleImage = "sampleimage",
  Image = "image",
  SampleVideo = "video",
  Vimeo = "vimeo",
  FileBrowser = "filebrowser",
}

export interface ContentBlockProps {
  frameId: FrameId
  contentData: { [key: string]: Json }
}
