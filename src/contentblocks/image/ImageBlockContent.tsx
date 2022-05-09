import React, { useEffect, useMemo, useState } from "react"
import { Box, CircularProgress, Grid } from "@mui/material"
import { Json } from "../../common/types"
import { useImageKeeper } from "../../image-keeper/ImageKeeperContext"
import { ImageKeeperResponse, KeeperImage } from "../../image-keeper/types"

interface ImageBlockParams {
  path: string
}

interface ImageBlockContentProps {
  contentData: { [key: string]: Json } | any
  onImageLoad?(imageSrc: string): void
}

const ImageBlockContent: React.FC<ImageBlockContentProps> = ({
  contentData,
  onImageLoad,
}) => {
  const { requestImage } = useImageKeeper()
  const { path: imagePath } = (contentData as unknown) as ImageBlockParams
  const [src, setSrc] = useState<string>(null)

  const imageKeeperResponse = useMemo<Promise<ImageKeeperResponse>>(
    async () => await requestImage(imagePath),
    [imagePath, requestImage]
  )

  useEffect(() => {
    async function wait() {
      const keeperImage = (await imageKeeperResponse).keeperImage
      setSrc(keeperImage.objectUrl)
    }
    void wait()
  }, [imageKeeperResponse, onImageLoad])

  useEffect(() => {
    async function wait() {
      const keeperImage = (await imageKeeperResponse).keeperImage
      if (keeperImage) {
        onImageLoad && onImageLoad(keeperImage.objectUrl)
      }
    }
    void wait()
  }, [imageKeeperResponse, onImageLoad])

  return src ? (
    // @ts-ignore
    <Box
      component={"img"}
      src={src}
      // width={keeperImage.width}
      // height={keeperImage.height}
      sx={{ width: "100%", height: "100%", objectFit: "contain" }}
      async={true}
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
