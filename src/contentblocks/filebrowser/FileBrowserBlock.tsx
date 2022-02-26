import React, { useContext, useEffect } from "react"
import FileBrowserDirectoryContent from "./FileBrowserDirectoryContent"
import FileBrowserTopbar from "./FileBrowserTopbar"
import { ContentBlockProps } from "../types"
import { FileBrowserNavigatorContext } from "./FileBrowserNavigatorContext"
import FileBrowserFooter from "./FileBrowserFooter"
import { FrameContext } from "../../core/frames"
import FileSystemBusyIndicator from "./FileSystemBusyIndicator"
import FileBrowserBackgroundProgressIndicator from "./FileBrowserBackgroundProgressIndicator"
import { FileBrowserContextProvider } from "./FileBrowserContext"
import { FileBrowserFilterContext } from "./FileBrowserFilterContext"
import { Box } from "@mui/material"
import FileBrowserBlockLayout from "./FileBrowserBlockLayout"

const FileBrowserBlock: React.FC<ContentBlockProps> = ({ frameId }) => {
  const frameContext = useContext(FrameContext)
  useEffect(() => {
    frameContext.preventResizingWithWheel()
    frameContext.preventResizing()
    frameContext.preventFullscreen()
  }, [frameContext])

  return (
    <FileBrowserContextProvider frameId={frameId}>
      <Box
        sx={{
          display: "flex",
          background: `rgba(255, 255, 255, .95)`,
          width: "100%",
          height: "100%",
          boxShadow: 3,
        }}
        onWheel={event => event.stopPropagation()}
      >
        <FileBrowserBlockLayout />
      </Box>
    </FileBrowserContextProvider>
  )
}

export default FileBrowserBlock
