import VimeoBlock from "./VimeoBlock/VimeoBlock"
import DummyBlock from "./DummyBlock/DummyBlock"
import ImageBlock from "./ImageBlock/ImageBlock"
import VideoBlock from "./VideoBlock/VideoBlock"
import React from "react"
import { FrameId } from "../core/presentations/interfaces"
import FileBrowserBlock from "../veedrive/components/FileBrowserBlock/FileBrowserBlock"

export enum ContentBlockTypes {
  Dummy = "dummy",
  SampleImage = "sampleimage",
  SampleVideo = "video",
  Vimeo = "vimeo",
  FileBrowser = "filebrowser",
}

interface ContentBlockProps {
  frameId: FrameId
}

export const contentBlockRegister: Record<string,
  React.FC<ContentBlockProps> | React.NamedExoticComponent<ContentBlockProps>> = {
  [ContentBlockTypes.Dummy]: DummyBlock,
  [ContentBlockTypes.SampleImage]: ImageBlock,
  [ContentBlockTypes.SampleVideo]: VideoBlock,
  [ContentBlockTypes.Vimeo]: VimeoBlock,
  [ContentBlockTypes.FileBrowser]: FileBrowserBlock,
}
