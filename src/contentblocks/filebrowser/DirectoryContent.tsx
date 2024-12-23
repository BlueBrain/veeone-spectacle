import React, { useCallback, useEffect, useRef } from "react"
import { useFileBrowserNavigator } from "./FileBrowserNavigatorContext"
import { FileBrowserViewTypes } from "./types"
import DirectoryThumbnailsView from "./DirectoryThumbnailsView"
import DirectoryListView from "./DirectoryListView"
import { BrowserDirectory, BrowserFile } from "../../veedrive/common/models"
import EmptyResults from "./EmptyResults"
import { useFileBrowserSearch } from "./FileBrowserSearchContext"
import { useFileBrowser } from "./FileBrowserContext"
import { Box } from "@mui/material"
import { useVisualKeyboard } from "../../visualkeyboard/VisualKeyboardContext"

interface DirectoryContentProps {
  files: BrowserFile[]
  dirs: BrowserDirectory[]
}

const DirectoryContent: React.FC<DirectoryContentProps> = ({
  dirs = [],
  files = [],
}) => {
  const { frameId, viewType } = useFileBrowser()
  const { setScrollableAreaRef } = useFileBrowserNavigator()
  const { isSearchingInProgress } = useFileBrowserSearch()
  const { closeKeyboardById } = useVisualKeyboard()
  const displayType = viewType ?? FileBrowserViewTypes.Thumbnails
  const isEmpty = !dirs.length && !files.length
  const scrollableContentRef = useRef(null)

  const closeAnyKeyboards = useCallback(() => {
    const keyboardIdToClose = `search-files-${frameId}`
    closeKeyboardById(keyboardIdToClose)
  }, [closeKeyboardById, frameId])

  useEffect(() => {
    const currentRef = scrollableContentRef.current
    if (currentRef) {
      setScrollableAreaRef(currentRef)
    }
    return () => {
      setScrollableAreaRef(null)
    }
  }, [setScrollableAreaRef])

  return (
    <Box
      onTouchEnd={closeAnyKeyboards}
      onMouseUp={closeAnyKeyboards}
      ref={scrollableContentRef}
      sx={{
        display: "flex",
        flex: "1",
        overflowY: "scroll",
        overflowX: "visible",
        flexDirection: "column",
        padding: "1rem .5rem 4rem .5rem",
        // Hide scrollbar
        scrollbarWidth: "none",
        "::-webkit-scrollbar": {
          display: "none",
        },
      }}
    >
      {isEmpty && !isSearchingInProgress ? (
        <EmptyResults />
      ) : displayType === FileBrowserViewTypes.Thumbnails ? (
        <DirectoryThumbnailsView dirs={dirs} files={files} />
      ) : (
        <DirectoryListView dirs={dirs} files={files} />
      )}
    </Box>
  )
}

export default DirectoryContent
