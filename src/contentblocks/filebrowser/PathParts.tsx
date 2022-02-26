import React from "react"
import { Button, IconButton, Tooltip } from "@mui/material"
import { styled } from "@mui/material/styles"
import { Home } from "@mui/icons-material"
import { useFileBrowserNavigator } from "./FileBrowserNavigatorContext"

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
    <>
      <Tooltip title="Move to the home directory">
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
          <Button onClick={() => onSelectPathPart(index + 1)} key={index}>
            {part}
          </Button>
        ))}
    </>
  )
}

const StyledPathParts = styled(PathParts)(
  ({ theme }) => `
  text-decoration: none;
  padding: 0 0.2rem;
  margin-right: 0.4rem;
  box-shadow: 0.1rem 0.1rem 0.2rem rgba(0, 0, 0, 0.1);
  color: ${theme.palette.primary.main};

  ::after {
    content: "/";
  }
`
)

export default StyledPathParts
