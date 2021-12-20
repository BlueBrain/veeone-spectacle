import React, { useContext, useEffect, useRef, useState } from "react"
import styled from "styled-components"
import fileService from "../../veedrive"
import { BrowserFile } from "../../veedrive/common/models"
import { FileBrowserContext } from "./FileBrowserContext"
import { InsertDriveFile } from "@mui/icons-material"
import useInteractable from "../../core/interactable/useInteractable"

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
  const [thumbnailUrl, setThumbnailUrl] = useState("")
  const { requestFile } = useContext(FileBrowserContext)

  useEffect(() => {
    let isMounted = true
    const loadThumbnail = async () => {
      console.debug("loadThumbnail", file.path)
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

  const ref = useRef()

  useInteractable(ref, {
    onTap: event => {
      event.stopPropagation()
      requestFile(file.path)
    },
  })

  return (
    <div className={classes.gridTile} title={file.name} ref={ref}>
      <div className={classes.gridTileThumbnail}>
        <div className={classes.gridTileThumbnailBody}>
          {thumbnailUrl ? (
            <StyledImage src={thumbnailUrl} />
          ) : (
            <InsertDriveFile fontSize={"large"} />
          )}
        </div>
      </div>
      <div className={classes.gridTileLabel}>{file.name}</div>
    </div>
  )
}
export default FileElement
