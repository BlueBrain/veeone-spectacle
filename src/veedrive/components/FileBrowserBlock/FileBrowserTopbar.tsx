import React from "react"
import styled from "styled-components"

interface Props {
  activePath: string

  onSelectPathPart(pathPart: number)
}

const StyledFileBrowserTopbar = styled.div`
  background: #ddd;
  padding: 10px;
  width: 100%;
  height: 50px;
  box-sizing: border-box;
  display: flex;
`

const StyledPathPart = styled.a`
  background: rgba(0, 0, 0, .1);
  border-radius: 20px;
  text-decoration: none;
  padding: 0 10px;
`

const FileBrowserTopbar: React.FC<Props> = ({ activePath, onSelectPathPart }) => {

  const makePathParts = (path: string) => {
    return path.split("/").filter((part) => part !== "").map((part, index, all) =>
      <StyledPathPart key={index}
                      onClick={() => onSelectPathPart(index + 1)} href={"#"}>
        {part}
      </StyledPathPart>
    )
  }

  return <StyledFileBrowserTopbar>
    <StyledPathPart onClick={() => onSelectPathPart(0)} href={"#"}>
      /
    </StyledPathPart>
    {makePathParts(activePath)}

  </StyledFileBrowserTopbar>
}

export default FileBrowserTopbar
