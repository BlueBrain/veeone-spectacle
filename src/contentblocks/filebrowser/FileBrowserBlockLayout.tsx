import { Box } from "@mui/material"
import React from "react"
import NavigationAndSearchBar from "./NavigationAndSearchBar"
import BackgroundProgressIndicator from "./BackgroundProgressIndicator"
import DirectoryContent from "./DirectoryContent"
import BusyIndicator from "./BusyIndicator"
import Footer from "./Footer"
import { useFileBrowser } from "./FileBrowserContext"
import { useFileBrowserNavigator } from "./FileBrowserNavigatorContext"
import { useFileBrowserFilter } from "./FileBrowserFilterContext"
import PathParts from "./PathParts"

const FileBrowserBlockLayout: React.FC = () => {
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
        <NavigationAndSearchBar />
        <BackgroundProgressIndicator />
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
          <DirectoryContent dirs={filteredDirs} files={filteredFiles} />
        ) : (
          <BusyIndicator />
        )}
      </Box>
      {!isLoading ? <Footer /> : null}
    </Box>
  )
}

export default FileBrowserBlockLayout
