import VimeoBlock from "./VimeoBlock/VimeoBlock"
import DummyBlock from "./DummyBlock/DummyBlock"
import ImageBlock from "./ImageBlock/ImageBlock"
import VideoBlock from "./VideoBlock/VideoBlock"
import React from "react"
import FileBrowserBlock from "../veedrive/components/FileBrowserBlock/FileBrowserBlock"
import { ContentBlockProps, ContentBlockTypes } from "./types"


export const contentBlockRegister: Record<string,
  React.FC<ContentBlockProps> | React.NamedExoticComponent<ContentBlockProps>> = {
  [ContentBlockTypes.Dummy]: DummyBlock,
  [ContentBlockTypes.Image]: ImageBlock,
  [ContentBlockTypes.SampleVideo]: VideoBlock,
  [ContentBlockTypes.Vimeo]: VimeoBlock,
  [ContentBlockTypes.FileBrowser]: FileBrowserBlock,
}
