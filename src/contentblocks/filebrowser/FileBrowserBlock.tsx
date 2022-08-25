import React, { useEffect } from "react"
import { FileBrowserContextProvider } from "./FileBrowserContext"
import { Box, Grow } from "@mui/material"
import FileBrowserBlockLayout from "./FileBrowserBlockLayout"
import { useFrame } from "../../frames/FrameContext"

const FileBrowserBlock: React.FC = () => {
  const {
    frameId,
    preventResizing,
    preventResizingWithWheel,
    preventFullscreen,
  } = useFrame()

  useEffect(() => {
    preventResizingWithWheel()
    preventResizing()
    preventFullscreen()
  }, [preventFullscreen, preventResizing, preventResizingWithWheel])

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
