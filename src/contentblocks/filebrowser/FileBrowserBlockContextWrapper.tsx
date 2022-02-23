import React from "react"
import { FileBrowserSearchContextProvider } from "./FileBrowserSearchContext"
import { FrameId } from "../../core/types"
import { FileBrowserContextProvider } from "./FileBrowserContext"

interface FileBrowserBlockContextProviderProps {
  frameId: FrameId
}

export const FileBrowserBlockContextWrapper: React.FC<FileBrowserBlockContextProviderProps> = ({
  frameId,
  children,
}) => {
  return (
    <FileBrowserSearchContextProvider>
      <FileBrowserContextProvider frameId={frameId}>
        {children}
      </FileBrowserContextProvider>
    </FileBrowserSearchContextProvider>
  )
}
