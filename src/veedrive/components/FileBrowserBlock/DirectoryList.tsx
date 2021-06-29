import React, { useContext } from "react"
import styled from "styled-components"
import {
  createStyles,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  makeStyles,
} from "@material-ui/core"
import { Folder, InsertDriveFile } from "@material-ui/icons"
import { FileBrowserContext } from "../../contexts/FileBrowserContext"
import { BrowserDirectory, BrowserFile } from "../../common/models"

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

const DirectoryList: React.FC<DirectoryListProps> = ({ dirs, files }) => {
  const classes = useStyles()
  const { navigateDirectory, requestFile } = useContext(FileBrowserContext)

  return (
    <StyledDataGrid>
      <List>
        {dirs.map((dir, i) => (
          <StyledListItem key={i}>
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
              onClick={() => requestFile(file.name)}
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

export default DirectoryList
