import React, { CSSProperties, useContext, useEffect, useState } from "react"
import styled from "styled-components"
import { ContentBlockProps } from "../types"
import fileService from "../../veedrive/service"
import { FrameContext } from "../../core/frames"

const StyledImageBlock = styled.div`
  width: 100%;
  height: 100%;
  background: black;
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.3);
`

interface ImageBlockParams {
  path: string
}

const imgStyle: CSSProperties = {
  width: "100%",
  height: "100%",
  objectFit: "contain",
}

const ImageBlock: React.FC<ContentBlockProps> = props => {
  const [imageUrl, setImageUrl] = useState<string>("")
  const { path: imagePath } = (props.contentData as unknown) as ImageBlockParams
  const { updateAspectRatio } = useContext(FrameContext)

  const loadImageWithDimensions = url => {
    // read image dimensions
    const img = new Image()
    img.onload = function (event) {
      // @ts-ignore
      console.log("Image loaded", url, this.width, this.height)
      setImageUrl(url)
      // @ts-ignore
      const aspectRatio = this.width / this.height
      updateAspectRatio(aspectRatio)
    }
    img.src = url
  }

  useEffect(() => {
    const loadThumbnail = async () => {
      const response = await fileService.requestFile({ path: imagePath })
      if (response !== undefined && !!response.thumbnail) {
        console.debug("Got image", response)
        loadImageWithDimensions(response.url)
      } else {
        // todo handle invalid images/paths/responses
      }
    }
    void loadThumbnail()
  }, [imageUrl])

  return (
    <StyledImageBlock>
      {!!imageUrl ? <img src={imageUrl} style={imgStyle} alt={""} /> : null}
    </StyledImageBlock>
  )
}

export default ImageBlock
