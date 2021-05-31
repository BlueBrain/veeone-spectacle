import React, { CSSProperties, useEffect, useState } from "react"
import styled from "styled-components"
import { ContentBlockProps } from "../types"
import fileService from "../../veedrive/service"

const StyledImageBlock = styled.div`
  width: 100%;
  height: 100%;
  background: black;
  box-shadow: 0 5px 10px rgba(0, 0, 0, .3);
`

interface ImageBlockParams {
  path: string
}

const imgStyle: CSSProperties = {
  width: "100%",
  height: "100%",
  objectFit: "contain",
}

const ImageBlock: React.FC<ContentBlockProps> = (props) => {
  const [ imageUrl, setImageUrl ] = useState<string>("")
  const { path: imagePath } = props.contentData as unknown as ImageBlockParams

  useEffect(() => {
    const loadThumbnail = async () => {
      const response = await fileService.requestFile({ path: imagePath })
      if (response !== undefined && !!response.thumbnail) {
        console.debug("Got image", response)
        setImageUrl(response.url)
      } else {
        // todo handle invalid images/paths/responses
      }
    }
    void loadThumbnail()
  })

  return <StyledImageBlock>
    <img src={imageUrl} style={imgStyle} alt={""} />
  </StyledImageBlock>
}

export default ImageBlock
