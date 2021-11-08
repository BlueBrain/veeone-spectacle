import React, { useContext } from "react"
import styled from "styled-components"
import { Grid, IconButton, Tooltip } from "@material-ui/core"
import {
  ArrowBack,
  ArrowForward,
  ArrowUpward,
  Home,
  Search,
} from "@material-ui/icons"
import { FileBrowserContext } from "../../contexts/FileBrowserContext"
import BrowsingHistorySelector from "./BrowsingHistorySelector"
import ViewTypeSelector from "./ViewTypeSelector"
import SearchFilesBar from "./SearchFilesBar"
import FiltersSelector from "./FiltersSelector"

interface Props {
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

const FileBrowserTopbar: React.FC<Props> = ({ onSelectPathPart }) => {
  const {
    activePath,
    history,
    historyIndex,
    navigateBack,
    navigateForward,
    navigateUp,
    navigateDirectory,
    setSearchMode,
    searchModeOn,
  } = useContext(FileBrowserContext)

  const navigateHome = () => {
    void navigateDirectory("")
  }

  const makePathParts = (path: string) => {
    return (
      <>
        {path
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
          ))}
      </>
    )
  }

  const disableForwardButton = historyIndex === 0
  const disableBackButton = historyIndex === history.length - 1
  const hideUpButton = activePath.length === 0

  return (
    <StyledFileBrowserTopbar>
      {searchModeOn ? (
        <SearchFilesBar />
      ) : (
        <Grid container alignItems="center">
          <Grid item>
            <Tooltip title="Back">
              <span>
                <IconButton onClick={navigateBack} disabled={disableBackButton}>
                  <ArrowBack />
                </IconButton>
              </span>
            </Tooltip>
            <Tooltip title="Forward">
              <span>
                <IconButton
                  onClick={navigateForward}
                  disabled={disableForwardButton}
                >
                  <ArrowForward />
                </IconButton>
              </span>
            </Tooltip>

            <BrowsingHistorySelector />

            <Tooltip title="Move to the home directory">
              <span>
                <IconButton onClick={navigateHome} disabled={hideUpButton}>
                  <Home />
                </IconButton>
              </span>
            </Tooltip>

            {!hideUpButton ? (
              <Tooltip title="Move to the parent directory">
                <span>
                  <IconButton onClick={navigateUp}>
                    <ArrowUpward />
                  </IconButton>
                </span>
              </Tooltip>
            ) : null}
          </Grid>

          <Grid item xs>
            {/*<StyledPathPart onClick={() => onSelectPathPart(0)} href={"#"} />*/}
            {makePathParts(activePath)}
          </Grid>

          <Grid item>
            <FiltersSelector />

            <Tooltip title="Search files and directories">
              <IconButton onClick={() => setSearchMode(true)}>
                <Search />
              </IconButton>
            </Tooltip>

            <ViewTypeSelector />
          </Grid>
        </Grid>
      )}
    </StyledFileBrowserTopbar>
  )
}

export default FileBrowserTopbar
