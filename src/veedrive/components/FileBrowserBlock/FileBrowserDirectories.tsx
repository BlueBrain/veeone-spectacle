import React from "react"
import { DirectoryItem } from "../../types"
import styled from "styled-components"

interface Props {
  dirs: DirectoryItem[]

  onOpenDirectory(dirPath: string)
}

const StyledFileBrowserDirectories = styled.div`
  overflow-y: scroll;
  
  ul {
    list-style: none;
    margin: 0;
    padding: 0 0 0 20px;
    
    li {
      margin: 0;
      padding: 0;
      
      a {
        font-size: .7rem;
        display: flex;
        flex-grow: 1;
        padding: 0px 5px;
        text-decoration: none;
        
        &:hover {
          background: rgba(0, 0, 0, .1);
        }
      }
    }
  }
`

const FileBrowserDirectories: React.FC<Props> = ({ dirs = [], onOpenDirectory }) => {
  const openDirectory = (dirPath) => {
    console.debug("open dir", dirPath)
    onOpenDirectory(dirPath)
  }

  return <StyledFileBrowserDirectories>

    <ul>

      {dirs.map((dir) =>
        <li key={dir.name}>
          <a href={"#"}
             onClick={() => openDirectory(dir.path)}>
            {dir.name}
          </a>
          {dir.directories !== undefined
            ? <FileBrowserDirectories dirs={dir.directories} onOpenDirectory={openDirectory} />
            : null}
        </li>
      )}
    </ul>

  </StyledFileBrowserDirectories>
}

export default FileBrowserDirectories
