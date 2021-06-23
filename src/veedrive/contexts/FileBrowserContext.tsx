import React from "react"
import { FrameId } from "../../core/presentations/interfaces"
import { FileBrowserViewTypes } from "../common/types"

export interface FileBrowserContextProps {
  frameId?: FrameId

  activePath: string

  historyIndex: number

  history: string[]

  viewType: FileBrowserViewTypes

  navigateUp(): void

  navigateBack(): void

  navigateForward(): void

  navigateToIndex(historyIndex: number): void

  navigateDirectory(dirPath: string): void

  requestFile(fileName: string): void

  changeViewType(newViewType: FileBrowserViewTypes): void
}

export const FileBrowserContext = React.createContext<FileBrowserContextProps>({
  activePath: "",
  historyIndex: 0,
  history: [""],
  viewType: FileBrowserViewTypes.Thumbnails,
  navigateUp: () => {
    throw new Error("Not implemented")
  },
  navigateBack: () => {
    throw new Error("Not implemented")
  },
  navigateForward: () => {
    throw new Error("Not implemented")
  },
  navigateToIndex: () => {
    throw new Error("Not implemented")
  },
  navigateDirectory: () => {
    throw new Error("Not implemented")
  },
  requestFile: () => {
    throw new Error("Not implemented")
  },
  changeViewType(newViewType: FileBrowserViewTypes) {
    throw new Error("Not implemented")
  },
})
