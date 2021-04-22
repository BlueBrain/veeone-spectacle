import VimeoBlock from "./VideoFileBlock/VimeoBlock"
import DummyBlock from "./DummyBlock/DummyBlock"

export enum ContentBlockTypes {
  Dummy = "dummy",
  Vimeo = "vimeo"
}

export const contentBlockRegister = {
  [ContentBlockTypes.Dummy]: DummyBlock,
  [ContentBlockTypes.Vimeo]: VimeoBlock,
}
