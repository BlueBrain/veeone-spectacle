import VimeoBlock from "./VimeoBlock/VimeoBlock"
import DummyBlock from "./DummyBlock/DummyBlock"
import ImageBlock from "./ImageBlock/ImageBlock"
import VideoBlock from "./VideoBlock/VideoBlock"
import React from "react"

export enum ContentBlockTypes {
  Dummy = "dummy",
  SampleImage = "sampleimage",
  SampleVideo = "video",
  Vimeo = "vimeo",
}

export const contentBlockRegister: Record<string, React.FC | React.NamedExoticComponent> = {
  [ContentBlockTypes.Dummy]: DummyBlock,
  [ContentBlockTypes.SampleImage]: ImageBlock,
  [ContentBlockTypes.SampleVideo]: VideoBlock,
  [ContentBlockTypes.Vimeo]: VimeoBlock,
}
