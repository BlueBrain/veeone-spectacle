import { Box } from "@mui/material"
import React from "react"
import FileBrowserTopbar from "./FileBrowserTopbar"
import FileBrowserBackgroundProgressIndicator from "./FileBrowserBackgroundProgressIndicator"
import FileBrowserDirectoryContent from "./FileBrowserDirectoryContent"
import FileSystemBusyIndicator from "./FileSystemBusyIndicator"
import FileBrowserFooter from "./FileBrowserFooter"
import { useFileBrowser } from "./FileBrowserContext"
import { useFileBrowserNavigator } from "./FileBrowserNavigatorContext"
import { useFileBrowserFilter } from "./FileBrowserFilterContext"
import PathParts from "./PathParts"

interface FileBrowserBlockLayoutProps {}

const FileBrowserBlockLayout: React.FC<FileBrowserBlockLayoutProps> = () => {
  const { activePath } = useFileBrowser()
  const { isLoading, openDirectoryByPathPartIndex } = useFileBrowserNavigator()
  const { filteredFiles, filteredDirs } = useFileBrowserFilter()

  return (
    <Box
      sx={{ width: "100%", display: "flex", flexDirection: "column" }}
      className={"FileBrowserBlockLayout"}
    >
      <Box
        sx={{
          background: "white",
          boxShadow: 1,
        }}
      >
        <FileBrowserTopbar />
        <FileBrowserBackgroundProgressIndicator />
        <Box sx={{ display: "flex" }}>
          <PathParts
            path={activePath}
            onSelectPathPart={openDirectoryByPathPartIndex}
          />
        </Box>
      </Box>
      <Box
        sx={{
          width: "100%",
          display: "flex",
          overflow: "hidden",
          flexDirection: "row",
          flexGrow: 1,
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
  )
}

export default FileBrowserBlockLayout
