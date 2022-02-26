import React, { useContext, useEffect } from "react"
import DirectoryContent from "./DirectoryContent"
import NavigationAndSearchBar from "./NavigationAndSearchBar"
import { ContentBlockProps } from "../types"
import { FileBrowserNavigatorContext } from "./FileBrowserNavigatorContext"
import Footer from "./Footer"
import { FrameContext } from "../../core/frames"
import BusyIndicator from "./BusyIndicator"
import BackgroundProgressIndicator from "./BackgroundProgressIndicator"
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
