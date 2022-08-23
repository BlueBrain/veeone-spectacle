import VimeoBlock from "./vimeo/VimeoBlock"
import { ImageBlock } from "./image"
import { VideoBlock } from "./video"
import React from "react"
import { FileBrowserBlock } from "./filebrowser"
import { ContentBlockProps, ContentBlockTypes } from "./types"
import { WebsiteBlock } from "./website"

export const contentBlockRegister: Record<
  string,
  React.FC<ContentBlockProps> | React.NamedExoticComponent<ContentBlockProps>
> = {
  [ContentBlockTypes.Image]: ImageBlock,
  [ContentBlockTypes.SampleVideo]: VideoBlock,
  [ContentBlockTypes.Video]: VideoBlock,
  [ContentBlockTypes.Vimeo]: VimeoBlock,
  [ContentBlockTypes.FileBrowser]: FileBrowserBlock,
  [ContentBlockTypes.Website]: WebsiteBlock,
}
