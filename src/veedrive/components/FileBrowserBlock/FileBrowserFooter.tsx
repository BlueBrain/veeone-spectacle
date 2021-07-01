import React, { useContext } from "react"
import styled from "styled-components"
import { FileBrowserContext } from "../../contexts/FileBrowserContext"

const StyledFooter = styled.div`
  font-size: 0.8rem;
  padding: 0 1rem;
  color: rgba(0, 0, 0, 0.4);
`

const StyledNameFilterInfo = styled.span`
  color: red;
  font-weight: bold;
  padding-left: 0.5rem;
`

interface FileBrowserFooterProps {
  totalFilesCount: number
  hiddenFilesCount: number
}

const FileBrowserFooter: React.FC<FileBrowserFooterProps> = ({
  totalFilesCount,
  hiddenFilesCount,
}) => {
  const { nameFilterQuery } = useContext(FileBrowserContext)
  return (
    <StyledFooter>
      Total: {totalFilesCount} {totalFilesCount === 1 ? "file" : "files"}{" "}
      {hiddenFilesCount > 0 ? `(${hiddenFilesCount} hidden)` : null}
      {nameFilterQuery.length > 0 ? (
        <StyledNameFilterInfo>
          Filtering by name is active: `{nameFilterQuery}`
        </StyledNameFilterInfo>
      ) : null}
    </StyledFooter>
  )
}

export default FileBrowserFooter
