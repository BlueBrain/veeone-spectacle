import React from "react"
import { DirectoryItem, VeeDriveListDirectoryFile } from "../../types"
import styled from "styled-components"
import FileElement from "./FileElement"
import { faFolder, faTimes } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

interface Props {
  files: VeeDriveListDirectoryFile[]
  dirs: DirectoryItem[]

  onOpenDirectory(dirPath: string)

  onOpenUpperDirectory()

  onOpenFile(filename: string)
}

const StyledFileBrowserFileList = styled.div`
  display: flex;
  flex: 2;
  overflow-y: scroll;
  overflow-x: visible;
  flex-direction: column;
  padding: 2rem;
`

const StyledGridLayout = styled.div`
  //background: yellowgreen;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(6rem, 1fr));
  grid-gap: 1rem;
  margin-bottom: 1rem;
`

const StyledGridElement = styled.div`
  display: grid;
  padding: .5rem;
  background: #fff;
  cursor: pointer;
  //border: 1px solid magenta;
  box-sizing: border-box;
  font-size: 8pt;
  line-height: 1em;
  box-shadow: -.2rem .3rem .5rem rgba(0, 0, 0, .04), .2rem .3rem .5rem rgba(0, 0, 0, .04);
  border-radius: .3rem;

  ::before, div {
    width: 100%;
    height: 100%;
    grid-area: 1 / 1 / 2 / 2;
  }

  ::before {
    content: "";
    padding-bottom: 100%;
    display: block;
  }
`

const StyledDirElement = styled.div`
  display: flex;
  flex-direction: column;
  
  div {
    display: flex;
    align-items: flex-end;
    
    &:first-child {
      margin-top: 1rem;
      font-size: 4rem;
      align-items: center;
      justify-content: center;
    }
  }
`

const FileBrowserDirectoryContent: React.FC<Props> = (
  {
    dirs = [],
    files = [],
    onOpenDirectory,
    onOpenUpperDirectory,
    onOpenFile,
  }) => {
  const openDirectory = (dirPath) => {
    onOpenDirectory(dirPath)
  }

  const openUpperDirectory = () => {
    onOpenUpperDirectory()
  }

  const openFile = (fileName) => {
    onOpenFile(fileName)
  }

  return <StyledFileBrowserFileList>
    <button type="button" onClick={openUpperDirectory}>UP</button>
    <StyledGridLayout>
      {dirs.map((dir) =>
        <StyledGridElement key={dir.name}  onClick={() => openDirectory(dir.path)}>
          <StyledDirElement>
            <div style={{color: "#aaa"}}>
              <FontAwesomeIcon icon={faFolder} />
            </div>
            <div>{dir.name}</div>
          </StyledDirElement>
        </StyledGridElement>
      )}
    </StyledGridLayout>
    <StyledGridLayout>
      {files.map((file) =>
        <StyledGridElement key={file.name} onClick={() => openFile(file.name)}>
          <FileElement fileData={file} />
        </StyledGridElement>
      )}
    </StyledGridLayout>
  </StyledFileBrowserFileList>
}

export default FileBrowserDirectoryContent
