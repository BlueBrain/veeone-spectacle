import { ImageBlock } from "./image"
import { VideoBlock } from "./video"
import React from "react"
import { FileBrowserBlock } from "./filebrowser"
import { ContentBlockTypes } from "./types"
import { WebsiteBlock } from "./website"
import PDFReaderBlock from "./pdfreader"

export const contentBlockRegister: Record<
  string,
  React.FC | React.NamedExoticComponent
> = {
  [ContentBlockTypes.Image]: ImageBlock,
  [ContentBlockTypes.Video]: VideoBlock,
  [ContentBlockTypes.PDF]: PDFReaderBlock,
  [ContentBlockTypes.FileBrowser]: FileBrowserBlock,
  [ContentBlockTypes.Website]: WebsiteBlock,
}
