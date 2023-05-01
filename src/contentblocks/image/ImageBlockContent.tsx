import React, { useEffect, useMemo, useState } from "react"
import { Box, CircularProgress, Grid } from "@mui/material"
import { useImageKeeper } from "../../image-keeper/ImageKeeperContext"
import { ImageKeeperResponse, KeeperImage } from "../../image-keeper/types"
import { useConfig } from "../../config/AppConfigContext"
import ImageLoadingWarning from "./ImageLoadingWarning"

export interface ImageBlockParams {
  path: string
}

interface ImageBlockContentProps {
  contentData: ImageBlockParams
  onImageLoad?(keeperImage: KeeperImage): void
}

const ImageBlockContent: React.FC<ImageBlockContentProps> = ({
  contentData,
  onImageLoad,
}) => {
  const { requestImage } = useImageKeeper()
  const { path: imagePath } = contentData
  const [keeperImage, setKeeperImage] = useState<KeeperImage>(null)
  const [isLoadingImage, setIsLoadingImage] = useState<boolean>(false)
  const { LOAD_IMAGES_AS_CSS_BACKGROUND } = useConfig()

  const imageKeeperResponse = useMemo<Promise<ImageKeeperResponse>>(
    async () => await requestImage(imagePath),
    [imagePath, requestImage]
  )

  useEffect(() => {
    async function wait() {
      const keeperImage = (await imageKeeperResponse).keeperImage
      setIsLoadingImage(false)
      // Actually load the image
      setKeeperImage(keeperImage)
    }
    setIsLoadingImage(true)
    void wait()
  }, [imageKeeperResponse, onImageLoad])

  useEffect(() => {
    async function wait() {
      if (keeperImage) {
        onImageLoad && onImageLoad(keeperImage)
      }
    }
    void wait()
  }, [keeperImage, onImageLoad])

  const imageComponent = useMemo(
    () =>
      !keeperImage ? null : LOAD_IMAGES_AS_CSS_BACKGROUND ? (
        <Box
          sx={{
            background: `url("${keeperImage.objectUrl}") center`,
            backgroundRepeat: `no-repeat`,
            backgroundSize: `contain`,
            width: `100%`,
            height: `100%`,
            position: `absolute`,
            left: 0,
            top: 0,
          }}
        />
      ) : (
        <Box
          component={"img"}
          src={keeperImage.objectUrl}
          width={keeperImage.size.width}
          height={keeperImage.size.height}
          sx={{ width: "100%", height: "100%", objectFit: "contain" }}
          loading="lazy"
        />
      ),
    [LOAD_IMAGES_AS_CSS_BACKGROUND, keeperImage]
  )

  const shouldDisplayWarning = useMemo(() => !isLoadingImage && !keeperImage, [
    isLoadingImage,
    keeperImage,
  ])

  return (
    <>
      {shouldDisplayWarning ? (
        <ImageLoadingWarning />
      ) : keeperImage ? (
        imageComponent
      ) : (
        <Grid
          container
          justifyContent="center"
          alignItems="center"
          sx={{ height: "100%" }}
        >
          <Grid item>
            <CircularProgress />
          </Grid>
        </Grid>
      )}
    </>
  )
}

export default ImageBlockContent
