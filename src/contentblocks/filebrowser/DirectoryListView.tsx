import React from "react"
import styled from "styled-components"
import { Box, List, ListItem, ListItemIcon, ListItemText } from "@mui/material"
import createStyles from "@mui/styles/createStyles"
import makeStyles from "@mui/styles/makeStyles"
import { Folder, InsertDriveFile } from "@mui/icons-material"
import { useFileBrowserNavigator } from "./FileBrowserNavigatorContext"
import { BrowserDirectory, BrowserFile } from "../../veedrive/common/models"

interface DirectoryListProps {
  files: BrowserFile[]
  dirs: BrowserDirectory[]
}

const DirectoryListView: React.FC<DirectoryListProps> = ({ dirs, files }) => {
  const { navigateDirectory, requestFile } = useFileBrowserNavigator()

  return (
    <Box sx={{ width: "100%" }}>
      <List>
        {dirs.map(dir => (
          <Box key={dir.path}>
            <ListItem
              key={dir.path}
              sx={{
                overflow: "hidden",
              }}
              button
              onClick={() => navigateDirectory(dir.path)}
              title={dir.name}
            >
              <ListItemIcon>
                <Folder />
              </ListItemIcon>
              <ListItemText
                sx={{
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
                primary={dir.name}
              />
            </ListItem>
          </Box>
        ))}
        {files.map((file, i) => (
          <Box key={i}>
            <ListItem
              key={file.name}
              sx={{
                overflow: "hidden",
              }}
              button
              onClick={() => requestFile(file.path)}
              title={file.name}
            >
              <ListItemIcon>
                <InsertDriveFile />
              </ListItemIcon>
              <ListItemText
                sx={{
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
                primary={file.name}
              />
            </ListItem>
          </Box>
        ))}
      </List>
    </Box>
  )
}

export default DirectoryListView
