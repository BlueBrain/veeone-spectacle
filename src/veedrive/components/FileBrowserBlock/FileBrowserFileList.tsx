import React from "react"
import { DirectoryItem, VeeDriveListDirectoryFile } from "../../types"
import styled from "styled-components"

interface Props {
  files: VeeDriveListDirectoryFile[]
  dirs: DirectoryItem[]
}

const StyledFileBrowserFileList = styled.div`
  display: flex;
  flex: 2;
  overflow-y: scroll;
  
  ul {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-auto-rows: 100px;
    gap: 10px;
    margin: 0;
    padding: 0;
    list-style: none;
    
    li {
      list-style: none;
      padding: 10px;
      margin: 0;
      background: #ddd;
      font-size: 8pt;
      line-height: 1em;
    }
  }
`

const FileBrowserFileList: React.FC<Props> = ({ dirs = [], files = [] }) => {
  const openDirectory = (dirName) => {
    console.debug("openDirectory", dirName)
  }

  const openFile = (fileName) => {
    console.debug("openFile", fileName)
  }

  return <StyledFileBrowserFileList>
    {/*dir contents:*/}
    {/*<ul>*/}
    {/*  {dirs.map((dir) =>*/}
    {/*    <li key={dir.name}>*/}
    {/*      <a href={"#"} onClick={() => openDirectory(dir.path)}>/{dir.name}</a>*/}
    {/*    </li>*/}
    {/*  )}*/}
    {/*</ul>*/}
    <ul>
      {files.map((file) =>
        <li key={file.name}>
          <a href={"#"} onClick={() => openFile(file.name)}>{file.name} size: {file.size}</a>
        </li>
      )}
    </ul>
  </StyledFileBrowserFileList>
}

export default FileBrowserFileList
