import React from "react"
import { FrameId } from "../../core/presentations/interfaces"

export interface FileBrowserContextProps {
  frameId?: FrameId

  activePath: string

  historyIndex: number

  history: string[]

  navigateUp(): void

  navigateBack(): void

  navigateForward(): void

  navigateToIndex(historyIndex: number): void

  navigateDirectory(dirPath: string): void

  requestFile(fileName: string): void
}

export const FileBrowserContext = React.createContext<FileBrowserContextProps>({
  activePath: "",
  historyIndex: 0,
  history: [""],
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
})
