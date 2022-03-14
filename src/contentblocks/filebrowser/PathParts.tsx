import React from "react"
import { Box, Button, IconButton, Tooltip } from "@mui/material"
import { Home } from "@mui/icons-material"
import { useFileBrowserNavigator } from "./FileBrowserNavigatorContext"
import BrowsingHistorySelector from "./BrowsingHistorySelector"

interface PathPartsProps {
  path: string
  onSelectPathPart(pathPart: number)
}

const PathParts: React.FC<PathPartsProps> = ({ path, onSelectPathPart }) => {
  const { navigateDirectory } = useFileBrowserNavigator()
  const navigateHome = () => {
    void navigateDirectory("")
  }

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flex: "1",
        flexDirection: "row",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flex: "1",
          flexDirection: "row",
          textDecoration: "none",
          padding: 0,
          color: theme => theme.palette.primary.main,
          "::after": {
            content: `""`,
          },
        }}
      >
        <Tooltip title="Home directory" enterDelay={1000}>
          <span>
            <IconButton onClick={navigateHome} color={"primary"}>
              <Home />
            </IconButton>
          </span>
        </Tooltip>
        {path
          .split("/")
          .filter(part => part !== "")
          .map((part, index, all) => (
            <Button
              onClick={() => onSelectPathPart(index + 1)}
              key={index}
              color={"primary"}
            >
              {part}
            </Button>
          ))}
      </Box>
      <Box sx={{ display: "flex" }}>
        <BrowsingHistorySelector />
      </Box>
    </Box>
  )
}

export default PathParts
