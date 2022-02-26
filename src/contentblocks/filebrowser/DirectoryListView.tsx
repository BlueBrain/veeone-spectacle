import React from "react"
import styled from "styled-components"
import { List, ListItem, ListItemIcon, ListItemText } from "@mui/material"
import createStyles from "@mui/styles/createStyles"
import makeStyles from "@mui/styles/makeStyles"
import { Folder, InsertDriveFile } from "@mui/icons-material"
import { useFileBrowserNavigator } from "./FileBrowserNavigatorContext"
import { BrowserDirectory, BrowserFile } from "../../veedrive/common/models"

interface DirectoryListProps {
  files: BrowserFile[]
  dirs: BrowserDirectory[]
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

const useStyles = makeStyles(theme =>
  createStyles({
    listItem: {
      overflow: "hidden",
    },
    listItemText: {
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
    },
  })
)

const DirectoryListView: React.FC<DirectoryListProps> = ({ dirs, files }) => {
  const classes = useStyles()
  const { navigateDirectory, requestFile } = useFileBrowserNavigator()

  return (
    <StyledDataGrid>
      <List>
        {dirs.map(dir => (
          <StyledListItem key={dir.path}>
            <ListItem
              className={classes.listItem}
              key={dir.path}
              button
              onClick={() => navigateDirectory(dir.path)}
              title={dir.name}
            >
              <ListItemIcon>
                <Folder />
              </ListItemIcon>
              <ListItemText
                classes={{ primary: classes.listItemText }}
                primary={dir.name}
              />
            </ListItem>
          </StyledListItem>
        ))}
        {files.map((file, i) => (
          <StyledListItem key={i}>
            <ListItem
              className={classes.listItem}
              key={file.name}
              button
              onClick={() => requestFile(file.path)}
              title={file.name}
            >
              <ListItemIcon>
                <InsertDriveFile />
              </ListItemIcon>
              <ListItemText
                classes={{ primary: classes.listItemText }}
                primary={file.name}
              />
            </ListItem>
          </StyledListItem>
        ))}
      </List>
    </StyledDataGrid>
  )
}

export default DirectoryListView
