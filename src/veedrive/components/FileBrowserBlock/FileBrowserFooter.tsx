import React, { useContext } from "react"
import styled from "styled-components"
import { FileBrowserContext } from "../../contexts/FileBrowserContext"
import { IconButton, Tooltip } from "@material-ui/core"
import { Clear } from "@material-ui/icons"

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
  const { nameFilterQuery, filterByName } = useContext(FileBrowserContext)

  const clearFilters = () => {
    filterByName("")
  }

  return (
    <StyledFooter>
      Total: {totalFilesCount} {totalFilesCount === 1 ? "file" : "files"}{" "}
      {hiddenFilesCount > 0 ? `(${hiddenFilesCount} hidden)` : null}
      {nameFilterQuery.length > 0 ? (
        <StyledNameFilterInfo>
          Filtering by name is active: `{nameFilterQuery}`
          <Tooltip title="Clear filtering by name">
            <IconButton onClick={clearFilters} size="small">
              <Clear />
            </IconButton>
          </Tooltip>
        </StyledNameFilterInfo>
      ) : null}
    </StyledFooter>
  )
}

export default FileBrowserFooter
