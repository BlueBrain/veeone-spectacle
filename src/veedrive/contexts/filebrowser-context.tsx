import React from "react"

export interface FileBrowserContextProps {
  navigateUp(): void

  navigateBack(): void

  navigateForward(): void
}

export const FileBrowserContext = React.createContext<FileBrowserContextProps>({
  navigateUp: () => {},
  navigateBack: () => {},
  navigateForward: () => {},
})
