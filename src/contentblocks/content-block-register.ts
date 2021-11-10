import VimeoBlock from "./vimeo/VimeoBlock"
import ImageBlock from "./image/ImageBlock"
import VideoBlock from "./video/VideoBlock"
import React from "react"
import { FileBrowserBlock } from "../veedrive/components"
import { ContentBlockProps, ContentBlockTypes } from "./types"

export const contentBlockRegister: Record<
  string,
  React.FC<ContentBlockProps> | React.NamedExoticComponent<ContentBlockProps>
> = {
  [ContentBlockTypes.Image]: ImageBlock,
  [ContentBlockTypes.SampleVideo]: VideoBlock,
  [ContentBlockTypes.Video]: VideoBlock,
  [ContentBlockTypes.Vimeo]: VimeoBlock,
  [ContentBlockTypes.FileBrowser]: FileBrowserBlock,
}
