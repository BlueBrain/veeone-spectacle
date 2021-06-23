import React, { useContext } from "react"
import { DirectoryItem } from "../../types"
import styled from "styled-components"
import { FileBrowserContext } from "../../contexts/FileBrowserContext"

interface Props {
  dirs: DirectoryItem[]
}

const StyledFileBrowserDirectories = styled.div`
  overflow: scroll;

  ul {
    list-style: none;
    margin: 0;
    padding: 0 0 0 20px;

    li {
      margin: 0;
      padding: 0;

      a {
        font-size: 0.7rem;
        display: flex;
        flex-grow: 1;
        padding: 0px 5px;
        text-decoration: none;

        &:hover {
          background: rgba(0, 0, 0, 0.1);
        }
      }
    }
  }
`

const FileBrowserDirectories: React.FC<Props> = ({ dirs = [] }) => {
  const { navigateDirectory } = useContext(FileBrowserContext)
  const openDirectory = dirPath => navigateDirectory(dirPath)

  return (
    <StyledFileBrowserDirectories>
      <ul>
        {dirs.map(dir => (
          <li key={dir.name}>
            <a href={"#"} onClick={() => openDirectory(dir.path)}>
              {dir.path}
            </a>
            {dir.directories !== undefined ? (
              <FileBrowserDirectories dirs={dir.directories} />
            ) : null}
          </li>
        ))}
      </ul>
    </StyledFileBrowserDirectories>
  )
}

export default FileBrowserDirectories
