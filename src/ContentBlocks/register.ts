import VimeoBlock from "./VimeoBlock/VimeoBlock"
import DummyBlock from "./DummyBlock/DummyBlock"
import ImageBlock from "./ImageBlock/ImageBlock"

export enum ContentBlockTypes {
  Dummy = "dummy",
  Vimeo = "vimeo",
  SampleImage = "sampleimage",
}

export const contentBlockRegister = {
  [ContentBlockTypes.Dummy]: DummyBlock,
  [ContentBlockTypes.Vimeo]: VimeoBlock,
  [ContentBlockTypes.SampleImage]: ImageBlock,
}
