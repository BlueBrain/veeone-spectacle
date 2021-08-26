import React, { useContext, useEffect, useState } from "react"
import styled from "styled-components"
import fileService from "../../service"
import { BrowserFile } from "../../common/models"
import { FileBrowserContext } from "../../contexts/FileBrowserContext"
import { InsertDriveFile } from "@material-ui/icons"

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
    const loadThumbnail = async () => {
      const response = await fileService.requestFile({
        path: file.path,
      })
      if (response !== undefined && !!response.thumbnail) {
        setThumbnailUrl(response.thumbnail)
      }
    }
    void loadThumbnail()
  })
  return (
    <div
      className={classes.gridTile}
      onClick={() => requestFile(file.path)}
      title={file.name}
    >
      <div className={classes.gridTileThumbnail}>
        <div className={classes.gridTileThumbnailBody}>
          {!!thumbnailUrl ? (
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
