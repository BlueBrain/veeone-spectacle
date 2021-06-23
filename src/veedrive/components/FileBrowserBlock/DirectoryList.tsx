import React, { useContext } from "react"
import { GridColDef } from "@material-ui/data-grid"
import { DirectoryItem, VeeDriveListDirectoryFile } from "../../types"
import styled from "styled-components"
import { List, ListItem, ListItemIcon, ListItemText } from "@material-ui/core"
import {Folder, InsertDriveFile} from "@material-ui/icons"
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
  const { navigateDirectory, requestFile, viewType } = useContext(
    FileBrowserContext
  )

  const columns: GridColDef[] = [{ field: "name", headerName: "Name" }]

  const rows = [
    ...dirs.map((dir, index) => ({
      id: index,
      ...dir,
    })),
  ]

  return (
    <StyledDataGrid>
      <List>
        {dirs.map(dir => (
          <StyledListItem>
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
        {files.map(file => (
          <StyledListItem>
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
