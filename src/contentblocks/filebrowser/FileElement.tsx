import React, { useCallback, useEffect, useMemo, useRef, useState } from "react"
import styled from "styled-components"
import fileService from "../../veedrive"
import { BrowserFile } from "../../veedrive/common/models"
import { useFileBrowserNavigator } from "./FileBrowserNavigatorContext"
import { InsertDriveFile } from "@mui/icons-material"
import LazyThumbnailLoader from "./LazyThumbnailLoader"
import { useFileBrowserSelectionMode } from "./FileBrowserSelectionModeContext"
import interact from "interactjs"
import FileThumbnailSelected from "./FileThumbnailSelected"

interface FileElementProps {
  classes: any
  file: BrowserFile
}

const StyledImage = styled.img`
  width: 100%;
  object-fit: contain;
  aspect-ratio: 1;
  overflow: hidden;
`

const FileElement: React.FC<FileElementProps> = ({ file, classes }) => {
  const ref = useRef()
  const [thumbnailUrl, setThumbnailUrl] = useState("")
  const { requestFile } = useFileBrowserNavigator()
  const {
    isFileSelected,
    isSelectionModeEnabled,
    toggleSelectionMode,
    toggleFileSelect,
    selectFile,
  } = useFileBrowserSelectionMode()

  useEffect(() => {
    let isMounted = true
    const loadThumbnail = async () => {
      const response = await fileService.requestFile({
        path: file.path,
      })
      if (response !== undefined && !!response.thumbnail) {
        if (isMounted) {
          setThumbnailUrl(response.thumbnail)
        }
      }
    }
    void loadThumbnail()
    return () => {
      isMounted = false
    }
  }, [file.path])

  const isSelected = useMemo<boolean>(() => {
    return isFileSelected(file.path)
  }, [file.path, isFileSelected])

  const handleTap = useCallback(
    event => {
      if (isSelectionModeEnabled) {
        toggleFileSelect(file.path)
      } else {
        requestFile(file.path)
      }
      event.stopPropagation()
    },
    [file.path, isSelectionModeEnabled, requestFile, toggleFileSelect]
  )

  const handleHold = useCallback(
    event => {
      const selectionModeEnabled = toggleSelectionMode()
      if (selectionModeEnabled) {
        selectFile(file.path)
      }
    },
    [file.path, selectFile, toggleSelectionMode]
  )

  useEffect(() => {
    const currentRef = ref.current
    if (currentRef) {
      interact(currentRef)
        .pointerEvents({
          holdDuration: 400,
        })
        .on("tap", handleTap)
        .on("hold", handleHold)
    }
    return () => {
      interact(currentRef).unset()
    }
  }, [handleHold, handleTap])

  return (
    <div className={classes.gridTile} title={file.name} ref={ref}>
      <div className={classes.gridTileThumbnail}>
        <div className={classes.gridTileThumbnailBody}>
          <FileThumbnailSelected isSelected={isSelected}>
            {thumbnailUrl ? (
              <LazyThumbnailLoader>
                <StyledImage src={thumbnailUrl} />
              </LazyThumbnailLoader>
            ) : (
              <InsertDriveFile fontSize={"large"} />
            )}
          </FileThumbnailSelected>
        </div>
      </div>
      <div className={classes.gridTileLabel}>{file.name}</div>
    </div>
  )
}
export default FileElement
