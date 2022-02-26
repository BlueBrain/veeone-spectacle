import React, {
  CSSProperties,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react"
import styled from "styled-components"
import { ContentBlockProps } from "../types"
import fileService from "../../veedrive"
import { FrameContext } from "../../core/frames"
import FrameControlBar from "../../core/frames/FrameControlBar"
import { Size } from "../../common/types"
import { Box, CircularProgress, Grid } from "@mui/material"
import FloatingFrameControlBar from "../../core/frames/FloatingFrameControlBar"

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
  const [imageSize, setImageSize] = useState<Size>({ width: 0, height: 0 })
  const { path: imagePath } = (props.contentData as unknown) as ImageBlockParams
  const { updateAspectRatio } = useContext(FrameContext)
  const { width, height } = imageSize

  const loadImageWithDimensions = useCallback(
    url => {
      // read image dimensions
      const img = new Image()
      img.onload = function (event) {
        // @ts-ignore
        console.log("Image loaded", url, this.width, this.height)
        setImageUrl(url)
        // @ts-ignore
        setImageSize({ width: this.width, height: this.height })
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
  }, [imagePath, loadImageWithDimensions])

  useEffect(() => {
    void loadThumbnail()
  }, [loadThumbnail])

  return (
    <StyledImageBlock data-drag-handle={true}>
      {imageUrl ? (
        <img
          src={imageUrl}
          width={width}
          height={height}
          style={imgStyle}
          alt={""}
        />
      ) : (
        <Grid
          container
          justifyContent={"center"}
          alignItems={"center"}
          sx={{ height: "100%" }}
        >
          <Grid item>
            <CircularProgress />
          </Grid>
        </Grid>
      )}
      <FloatingFrameControlBar />
    </StyledImageBlock>
  )
}

export default ImageBlock
