import React, { useContext } from "react"
import styled from "styled-components"
import { FileBrowserContext } from "../../contexts/FileBrowserContext"
import { FileBrowserViewTypes } from "../../common/types"
import DirectoryThumbnails from "./DirectoryThumbnails"
import DirectoryList from "./DirectoryList"
import { BrowserDirectory, BrowserFile } from "../../common/models"

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
`

const FileBrowserDirectoryContent: React.FC<Props> = ({
  dirs = [],
  files = [],
}) => {
  const { viewType } = useContext(FileBrowserContext)

  const displayType = viewType ?? FileBrowserViewTypes.Thumbnails

  return (
    <StyledFileBrowserFileList>
      {displayType === FileBrowserViewTypes.Thumbnails ? (
        <DirectoryThumbnails dirs={dirs} files={files} />
      ) : (
        <DirectoryList dirs={dirs} files={files} />
      )}
    </StyledFileBrowserFileList>
  )
}

export default FileBrowserDirectoryContent
