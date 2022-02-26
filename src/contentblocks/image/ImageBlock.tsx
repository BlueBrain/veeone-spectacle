import React, {
  CSSProperties,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react"
import { ContentBlockProps } from "../types"
import fileService from "../../veedrive"
import { FrameContext } from "../../core/frames"
import { Size } from "../../common/types"
import { Box, CircularProgress, Grid } from "@mui/material"
import FloatingFrameControlBar from "../../core/frames/FloatingFrameControlBar"

interface ImageBlockParams {
  path: string
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
    <Box
      data-drag-handle={true}
      sx={{
        width: "100%",
        height: "100%",
        background: "black",
        boxShadow: 3,
      }}
    >
      {imageUrl ? (
        <Box
          component={"img"}
          src={imageUrl}
          width={width}
          height={height}
          sx={{ width: "100%", height: "100%", objectFit: "contain" }}
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
    </Box>
  )
}

export default ImageBlock
