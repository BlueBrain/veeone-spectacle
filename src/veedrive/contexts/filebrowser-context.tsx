import React from "react"

export interface FileBrowserContextProps {
  activePath: string

  navigateUp(): void

  navigateBack(): void

  navigateForward(): void

  navigateDirectory(dirPath: string): void

  requestFile(fileName: string): void
}

export const FileBrowserContext = React.createContext<FileBrowserContextProps>({
  activePath: "",
  navigateUp: () => {
    throw new Error("Not implemented")
  },
  navigateBack: () => {
    throw new Error("Not implemented")
  },
  navigateForward: () => {
    throw new Error("Not implemented")
  },
  navigateDirectory: () => {
    throw new Error("Not implemented")
  },
  requestFile: () => {
    throw new Error("Not implemented")
  },
})
