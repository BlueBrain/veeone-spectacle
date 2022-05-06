import React, { useEffect, useState } from "react"
import { Box, CircularProgress, Grid } from "@mui/material"
import { Json } from "../../common/types"
import { useSpectacle } from "../../core/spectacle/SpectacleContext"
import { VeeDriveFileResponse } from "../../veedrive/types"

interface ImageBlockParams {
  path: string
}

interface ImageBlockContentProps {
  contentData: { [key: string]: Json } | any
  onImageLoad?(image: HTMLImageElement): void
}

const ImageBlockContent: React.FC<ImageBlockContentProps> = ({
  contentData,
  onImageLoad,
}) => {
  const { veeDriveService } = useSpectacle()
  const { path: imagePath } = (contentData as unknown) as ImageBlockParams
  const [veeDriveImage, setVeeDriveImage] = useState<VeeDriveFileResponse>()
  const [imageObject, setImageObject] = useState<HTMLImageElement>()

  useEffect(() => {
    async function requestFile() {
      console.debug(`Request '${imagePath}' from VeeDrive`)
      const response = await veeDriveService.requestFile({ path: imagePath })
      setVeeDriveImage(response)
    }
    void requestFile()
  }, [imagePath, veeDriveService])

  useEffect(() => {
    if (!veeDriveImage?.url) {
      return
    }
    const img = new Image()
    img.onload = function (event) {
      console.debug(
        "Image loaded",
        veeDriveImage.url,
        (this as HTMLImageElement).width,
        (this as HTMLImageElement).height
      )
      setImageObject(img)
      onImageLoad && onImageLoad(img)
    }
    img.src = veeDriveImage.url
  }, [onImageLoad, veeDriveImage?.url])

  return imageObject ? (
    <Box
      component={"img"}
      src={imageObject.src}
      width={imageObject.width}
      height={imageObject.height}
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
