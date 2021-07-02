import { Json } from "../types"

export interface FileBrowserBlockPayload {
  [key: string]: Json

  history: string[]
  historyIndex: number
  viewType?: FileBrowserViewTypes
  isShowingHiddenFiles?: boolean
  isShowingSupportedFilesOnly?: boolean
}

export enum FileBrowserViewTypes {
  Thumbnails = "THUMBNAILS",
  List = "LIST",
}
