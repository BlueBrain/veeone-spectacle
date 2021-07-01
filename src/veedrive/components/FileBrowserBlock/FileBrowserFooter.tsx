import React from "react"
import styled from "styled-components"

const StyledFooter = styled.div`
  font-size: 0.8rem;
  padding: 0 1rem;
  color: rgba(0, 0, 0, 0.4);
`

interface FileBrowserFooterProps {
  totalFilesCount: number
  hiddenFilesCount: number
}

const FileBrowserFooter: React.FC<FileBrowserFooterProps> = ({
  totalFilesCount,
  hiddenFilesCount,
}) => {
  return (
    <StyledFooter>
      Total: {totalFilesCount} {totalFilesCount === 1 ? "file" : "files"}{" "}
      {hiddenFilesCount > 0 ? `(${hiddenFilesCount} hidden)` : null}
    </StyledFooter>
  )
}

export default FileBrowserFooter
