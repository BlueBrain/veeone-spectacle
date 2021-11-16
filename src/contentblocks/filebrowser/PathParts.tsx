import React from "react"
import { Button } from "@mui/material"
import { styled } from "@mui/material/styles"

interface PathPartsProps {
  path: string
  onSelectPathPart(pathPart: number)
}

const PathParts: React.FC<PathPartsProps> = ({ path, onSelectPathPart }) => {
  return (
    <>
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
