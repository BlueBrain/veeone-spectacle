import React, { useContext, useRef } from "react"
import styled from "styled-components"
import { FileBrowserContext } from "./FileBrowserContext"
import { FileBrowserViewTypes } from "./types"
import DirectoryThumbnails from "./DirectoryThumbnails"
import DirectoryList from "./DirectoryList"
import { BrowserDirectory, BrowserFile } from "../../veedrive/common/models"
import EmptyResults from "./EmptyResults"
import useInteractable from "../../core/interactable/useInteractable"
import { visualKeyboardService } from "../../visualkeyboard"

interface Props {
  files: BrowserFile[]
  dirs: BrowserDirectory[]
}

const StyledFileBrowserFileList = styled.div`
  display: flex;
  flex: 2;
  overflow-y: scroll;
  overflow-x: visible;
  flex-direction: column;
  padding: 0 1rem;

  // Hide scrollbar
  -ms-overflow-style: none;
  scrollbar-width: none;
  ::-webkit-scrollbar {
    display: none;
  }
`

const FileBrowserDirectoryContent: React.FC<Props> = ({
  dirs = [],
  files = [],
}) => {
  const { viewType, isSearchingInProgress, frameId } = useContext(
    FileBrowserContext
  )

  const displayType = viewType ?? FileBrowserViewTypes.Thumbnails

  const isEmpty = !dirs.length && !files.length

  const ref = useRef()

  useInteractable(ref, {
    onTap: () => {
      console.debug(
        `Hide keyboard from tapping on directory contents: ${frameId}`
      )
      visualKeyboardService.closeKeyboard(frameId)
    },
  })

  return (
    <StyledFileBrowserFileList ref={ref}>
      {isEmpty && !isSearchingInProgress ? (
        <EmptyResults />
      ) : displayType === FileBrowserViewTypes.Thumbnails ? (
        <DirectoryThumbnails dirs={dirs} files={files} />
      ) : (
        <DirectoryList dirs={dirs} files={files} />
      )}
    </StyledFileBrowserFileList>
  )
}

export default FileBrowserDirectoryContent
