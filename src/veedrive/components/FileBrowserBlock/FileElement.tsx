import React, { useEffect, useState } from "react"
import styled from "styled-components"
import fileService from "../../service"
import { BrowserFile } from "../../common/models"

interface FileElementProps {
  fileData: BrowserFile
}

const StyledFileElement = styled.div``

const StyledImage = styled.img`
  width: 100%;
  object-fit: contain;
  aspect-ratio: 1;
  overflow: hidden;
`

const StyledLabel = styled.a`
  position: relative;
  word-wrap: anywhere;
  text-align: center;
  display: block;
  font-weight: 600;
`

const FileElement: React.FC<FileElementProps> = ({ fileData }) => {
  const [thumbnailUrl, setThumbnailUrl] = useState("")
  useEffect(() => {
    const loadThumbnail = async () => {
      const response = await fileService.requestFile({
        path: fileData.fullpath,
      })
      if (response !== undefined && !!response.thumbnail) {
        setThumbnailUrl(response.thumbnail)
      }
    }
    void loadThumbnail()
  })
  return (
    <StyledFileElement>
      {!!thumbnailUrl ? <StyledImage src={thumbnailUrl} /> : null}
      <StyledLabel>{fileData.name}</StyledLabel>
    </StyledFileElement>
  )
}
export default FileElement
