import React, { useCallback, useEffect, useMemo, useState } from "react"
import { Box, CircularProgress, Grid } from "@mui/material"
import { useConfig } from "../../config/AppConfigContext"
import VeeDriveService from "../../veedrive"
import { Json, Size } from "../../common/types"

interface ImageBlockParams {
  path: string
}

interface ImageBlockContentProps {
  contentData: { [key: string]: Json } | any
  onImageLoad?(size: Size): void
}

const ImageBlockContent: React.FC<ImageBlockContentProps> = ({
  contentData,
  onImageLoad,
}) => {
  const [imageUrl, setImageUrl] = useState<string>("")
  const config = useConfig()
  const veeDriveService = useMemo(() => new VeeDriveService(config), [config])

  const [imageSize, setImageSize] = useState<Size>({ width: 0, height: 0 })
  const { path: imagePath } = (contentData as unknown) as ImageBlockParams
  const { width, height } = imageSize

  const loadImageWithDimensions = useCallback(
    url => {
      // Read image dimensions
      const img = new Image()
      img.onload = function (event) {
        // @ts-ignore
        console.log("Image loaded", url, this.width, this.height)
        setImageUrl(url)
        // @ts-ignore
        const newImageSize = { width: this.width, height: this.height }
        setImageSize(newImageSize)
        onImageLoad && onImageLoad(newImageSize)
      }
      img.src = url
    },
    [onImageLoad]
  )

  const loadThumbnail = useCallback(async () => {
    const response = await veeDriveService.requestFile({ path: imagePath })
    if (response !== undefined && !!response.thumbnail) {
      console.debug("Got image", response)
      loadImageWithDimensions(response.url)
    } else {
      // todo handle invalid images/paths/responses
    }
  }, [imagePath, loadImageWithDimensions, veeDriveService])

  useEffect(() => {
    void loadThumbnail()
  }, [loadThumbnail])

  return imageUrl ? (
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
  )
}

export default ImageBlockContent
