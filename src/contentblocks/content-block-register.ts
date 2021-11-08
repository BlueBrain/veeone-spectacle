import VimeoBlock from "./vimeo/VimeoBlock"
import DummyBlock from "./dummy/DummyBlock"
import ImageBlock from "./image/ImageBlock"
import VideoBlock from "./video/VideoBlock"
import React from "react"
import FileBrowserBlock from "../veedrive/components/FileBrowserBlock"
import { ContentBlockProps, ContentBlockTypes } from "./types"

export const contentBlockRegister: Record<
  string,
  React.FC<ContentBlockProps> | React.NamedExoticComponent<ContentBlockProps>
> = {
  [ContentBlockTypes.Dummy]: DummyBlock,
  [ContentBlockTypes.Image]: ImageBlock,
  [ContentBlockTypes.SampleVideo]: VideoBlock,
  [ContentBlockTypes.Vimeo]: VimeoBlock,
  [ContentBlockTypes.FileBrowser]: FileBrowserBlock,
}
