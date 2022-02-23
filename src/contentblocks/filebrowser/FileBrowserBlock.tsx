import styled from "styled-components"
import React, { useContext, useEffect } from "react"
import FileBrowserDirectoryContent from "./FileBrowserDirectoryContent"
import FileBrowserTopbar from "./FileBrowserTopbar"
import { ContentBlockProps } from "../types"
import { FileBrowserContext } from "./FileBrowserContext"
import FileBrowserFooter from "./FileBrowserFooter"
import { FrameContext } from "../../core/frames"
import FileSystemBusyIndicator from "./FileSystemBusyIndicator"
import FileBrowserBackgroundProgressIndicator from "./FileBrowserBackgroundProgressIndicator"
import { FileBrowserBlockContextWrapper } from "./FileBrowserBlockContextWrapper"

const StyledFileBrowserBlock = styled.div`
  background: #fafafa;
  width: 100%;
  height: 100%;
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.3);
`

const StyledBlockContent = styled.div`
  width: 100%;
  height: calc(100% - 6rem);
`

const StyledMain = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  flex: 1;
`

const FileBrowserBlock: React.FC<ContentBlockProps> = ({ frameId }) => {
  const frameContext = useContext(FrameContext)
  useEffect(() => {
    frameContext.preventResizingWithWheel()
    frameContext.preventResizing()
    frameContext.preventFullscreen()
  }, [frameContext])

  return (
    <FileBrowserBlockContextWrapper frameId={frameId}>
      <StyledFileBrowserBlock onWheel={event => event.stopPropagation()}>
        <FileBrowserContext.Consumer>
          {({ isLoading, filteredDirs, filteredFiles }) => (
            <StyledBlockContent>
              <FileBrowserTopbar />
              <FileBrowserBackgroundProgressIndicator />
              <StyledMain>
                {!isLoading ? (
                  <FileBrowserDirectoryContent
                    dirs={filteredDirs}
                    files={filteredFiles}
                  />
                ) : (
                  <FileSystemBusyIndicator />
                )}
              </StyledMain>
              {!isLoading ? <FileBrowserFooter /> : null}
            </StyledBlockContent>
          )}
        </FileBrowserContext.Consumer>
      </StyledFileBrowserBlock>
    </FileBrowserBlockContextWrapper>
  )
}

export default FileBrowserBlock
