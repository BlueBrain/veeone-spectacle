import React, { useContext } from "react"
import { DirectoryItem, VeeDriveListDirectoryFile } from "../../types"
import styled from "styled-components"
import { List, ListItem, ListItemIcon, ListItemText } from "@material-ui/core"
import { Folder, InsertDriveFile } from "@material-ui/icons"
import { FileBrowserContext } from "../../contexts/FileBrowserContext"

interface DirectoryListProps {
  files: VeeDriveListDirectoryFile[]
  dirs: DirectoryItem[]
}

const StyledDataGrid = styled.div`
  width: 100%;
  columns: 3;
`

const StyledListItem = styled.div`
  -webkit-column-break-inside: avoid;
  page-break-inside: avoid;
  break-inside: avoid;
`

const DirectoryList: React.FC<DirectoryListProps> = ({ dirs, files }) => {
  const { navigateDirectory } = useContext(
    FileBrowserContext
  )

  return (
    <StyledDataGrid>
      <List>
        {dirs.map((dir, i) => (
          <StyledListItem key={i}>
            <ListItem
              key={dir.path}
              button
              onClick={() => navigateDirectory(dir.path)}
            >
              <ListItemIcon>
                <Folder />
              </ListItemIcon>
              <ListItemText primary={dir.name} />
            </ListItem>
          </StyledListItem>
        ))}
        {files.map((file, i) => (
          <StyledListItem key={i}>
            <ListItem
              key={file.name}
              button
              onClick={() => navigateDirectory(file.name)}
            >
              <ListItemIcon>
                <InsertDriveFile />
              </ListItemIcon>
              <ListItemText primary={file.name} />
            </ListItem>
          </StyledListItem>
        ))}
      </List>
    </StyledDataGrid>
  )
}

export default DirectoryList
