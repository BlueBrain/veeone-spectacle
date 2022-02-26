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
          background: "#fafafa",
          width: "100%",
          height: "100%",
          boxShadow: "0 5px 10px rgba(0, 0, 0, 0.3)",
        }}
        onWheel={event => event.stopPropagation()}
      >
        <FileBrowserNavigatorContext.Consumer>
          {({ isLoading }) => (
            <FileBrowserFilterContext.Consumer>
              {({ filteredDirs, filteredFiles }) => (
                <Box sx={{ width: "100%", height: "calc(100% - 6rem)" }}>
                  <FileBrowserTopbar />
                  <FileBrowserBackgroundProgressIndicator />
                  <Box
                    sx={{
                      width: "100%",
                      height: "100%",
                      display: "flex",
                      flexDirection: "row",
                      flex: "1",
                    }}
                  >
                    {!isLoading ? (
                      <FileBrowserDirectoryContent
                        dirs={filteredDirs}
                        files={filteredFiles}
                      />
                    ) : (
                      <FileSystemBusyIndicator />
                    )}
                  </Box>
                  {!isLoading ? <FileBrowserFooter /> : null}
                </Box>
              )}
            </FileBrowserFilterContext.Consumer>
          )}
        </FileBrowserNavigatorContext.Consumer>
      </Box>
    </FileBrowserContextProvider>
  )
}

export default FileBrowserBlock
