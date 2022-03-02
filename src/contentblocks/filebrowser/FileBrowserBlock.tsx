import React, { useContext, useEffect } from "react"
import { ContentBlockProps } from "../types"
import { FrameContext } from "../../core/frames"
import { FileBrowserContextProvider } from "./FileBrowserContext"
import { Box, Grow } from "@mui/material"
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
      <Grow in={true}>
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
      </Grow>
    </FileBrowserContextProvider>
  )
}

export default FileBrowserBlock
