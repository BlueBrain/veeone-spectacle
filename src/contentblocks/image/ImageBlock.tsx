import React, {
  CSSProperties,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react"
import styled from "styled-components"
import { ContentBlockProps } from "../types"
import fileService from "../../veedrive/service"
import { FrameContext } from "../../core/frames"
import FrameControlBar from "../../core/frames/FrameControlBar"

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

  const loadImageWithDimensions = useCallback(
    url => {
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
    },
    [updateAspectRatio]
  )

  const loadThumbnail = useCallback(async () => {
    const response = await fileService.requestFile({ path: imagePath })
    if (response !== undefined && !!response.thumbnail) {
      console.debug("Got image", response)
      loadImageWithDimensions(response.url)
    } else {
      // todo handle invalid images/paths/responses
    }
  }, [imagePath])

  useEffect(() => {
    void loadThumbnail()
  }, [loadThumbnail])

  return (
    <StyledImageBlock data-drag-handle={true}>
      {imageUrl ? <img src={imageUrl} style={imgStyle} alt={""} /> : null}
      <FrameControlBar floating={true} />
    </StyledImageBlock>
  )
}

export default ImageBlock
