import { Json } from "../../common/types"

export interface FileBrowserBlockPayload {
  [key: string]: Json

  history: string[]
  historyIndex: number
  viewType?: FileBrowserViewTypes
  isShowingHiddenFiles?: boolean
  isShowingUnsupportedFiles?: boolean
  nameFilterQuery?: string
}

export enum FileBrowserViewTypes {
  Thumbnails = "THUMBNAILS",
  List = "LIST",
}
