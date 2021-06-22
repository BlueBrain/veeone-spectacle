import React, { useContext } from "react"
import styled from "styled-components"
import { Grid, IconButton, Tooltip } from "@material-ui/core"
import { ArrowBack, ArrowForward, ArrowUpward } from "@material-ui/icons"
import { FileBrowserContext } from "../../contexts/filebrowser-context"
import BrowsingHistorySelector from "./BrowsingHistorySelector"

interface Props {
  activePath: string

  onSelectPathPart(pathPart: number)
}

const StyledFileBrowserTopbar = styled.div`
  padding: 10px;
  width: 100%;
  box-sizing: border-box;
  display: flex;
`

const StyledPathPart = styled.a`
  text-decoration: none;
  padding: 0 0.2rem;
  margin-right: 0.4rem;
  box-shadow: 0.1rem 0.1rem 0.2rem rgba(0, 0, 0, 0.1);

  ::after {
    content: "/";
  }
`

const FileBrowserTopbar: React.FC<Props> = ({
  activePath,
  onSelectPathPart,
}) => {
  const {
    history,
    historyIndex,
    navigateBack,
    navigateForward,
    navigateUp,
  } = useContext(FileBrowserContext)
  const makePathParts = (path: string) => {
    return path
      .split("/")
      .filter(part => part !== "")
      .map((part, index, all) => (
        <StyledPathPart
          key={index}
          onClick={() => onSelectPathPart(index + 1)}
          href={"#"}
        >
          {part}
        </StyledPathPart>
      ))
  }

  // const searchFilesystem = () => {}

  // const openFilterList = () => {}

  // const openLastDirectories = () => {}

  // const refreshDirectories = () => {}

  const disableForwardButton = historyIndex === 0

  const disableBackButton = historyIndex === history.length - 1

  return (
    <StyledFileBrowserTopbar>
      <Grid container alignItems="center">
        <Grid item>
          <Tooltip title="Back">
            <IconButton onClick={navigateBack} disabled={disableBackButton}>
              <ArrowBack />
            </IconButton>
          </Tooltip>
          <Tooltip title="Forward">
            <IconButton
              onClick={navigateForward}
              disabled={disableForwardButton}
            >
              <ArrowForward />
            </IconButton>
          </Tooltip>
          <Tooltip title="Show recently visited directories">
            <BrowsingHistorySelector />
          </Tooltip>
          <Tooltip title="Move to the parent directory">
            <IconButton onClick={navigateUp}>
              <ArrowUpward />
            </IconButton>
          </Tooltip>
        </Grid>

        <Grid item xs>
          <StyledPathPart onClick={() => onSelectPathPart(0)} href={"#"} />
          {makePathParts(activePath)}
        </Grid>

        <Grid item>
          {/*<Tooltip title="Filter view">*/}
          {/*  <IconButton onClick={openFilterList}>*/}
          {/*    <FilterList />*/}
          {/*  </IconButton>*/}
          {/*</Tooltip>*/}

          {/*<ViewTypeSelector />*/}

          {/*<Tooltip title="Search files and directories">*/}
          {/*  <IconButton onClick={searchFilesystem}>*/}
          {/*    <Search />*/}
          {/*  </IconButton>*/}
          {/*</Tooltip>*/}
        </Grid>
      </Grid>
    </StyledFileBrowserTopbar>
  )
}

export default FileBrowserTopbar
