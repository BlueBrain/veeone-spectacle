import React from "react"
import styled from "styled-components"
import { useFileBrowserNavigator } from "./FileBrowserNavigatorContext"
import { Box, Button, Grid } from "@mui/material"
import { useFileBrowserFilter } from "./FileBrowserFilterContext"
import ViewTypeSelector from "./ViewTypeSelector"

// const StyledFooter = styled.div`
//   font-size: 0.8rem;
//   padding: 0 1rem;
//   color: rgba(0, 0, 0, 0.4);
// `

interface FileBrowserFooterProps {}

const FileBrowserFooter: React.FC<FileBrowserFooterProps> = () => {
  const { totalFilesCount, hiddenFilesCount } = useFileBrowserNavigator()
  const { nameFilterQuery, filterByName } = useFileBrowserFilter()

  const clearFilters = () => {
    filterByName("")
  }

  return (
    <Box
      sx={{
        fontSize: "0.8rem",
        padding: ".5rem 1rem",
        color: `rgba(0, 0, 0, 0.4)`,
      }}
    >
      <Grid container alignItems="center" justifyContent={"space-between"}>
        <Grid item>
          Total: {totalFilesCount} {totalFilesCount === 1 ? "file" : "files"}{" "}
        </Grid>
        <Grid item xs>
          {hiddenFilesCount > 0 ? `(${hiddenFilesCount} hidden)` : null}
        </Grid>
        {nameFilterQuery.length > 0 ? (
          <Grid item>
            <>
              Filtering by name is active: {nameFilterQuery}
              <Button onClick={clearFilters} size="small" color={"secondary"}>
                Clear filter
              </Button>
            </>
          </Grid>
        ) : null}
        <Grid item>
          <ViewTypeSelector />
        </Grid>
      </Grid>
    </Box>
  )
}

export default FileBrowserFooter
