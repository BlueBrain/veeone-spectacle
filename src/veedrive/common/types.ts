import { Json } from "../types"

export interface FileBrowserBlockPayload {
  [key: string]: Json
  history: string[]
  historyIndex: number
}
