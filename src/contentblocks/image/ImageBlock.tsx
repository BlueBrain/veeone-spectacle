import React, { useEffect, useMemo, useState } from "react"
import { Box, Grow } from "@mui/material"
import FloatingFrameControlBar from "../../frames/FloatingFrameControlBar"
import ImageBlockContent, { ImageBlockParams } from "./ImageBlockContent"
import { KeeperImage } from "../../image-keeper/types"
import { useFrame } from "../../frames/FrameContext"

const ImageBlock: React.FC = () => {
  const [aspectRatio, setAspectRatio] = useState(1)
  const { updateAspectRatio, frameContentData } = useFrame()

  useEffect(() => {
    if (!isNaN(aspectRatio)) {
      updateAspectRatio(aspectRatio)
    }
  }, [aspectRatio, updateAspectRatio])

  const onImageLoad = useMemo(
    () => ({ size }: KeeperImage) => {
      const { width, height } = size
      setAspectRatio(width / height)
    },
    []
  )

  return (
    <Grow in={true}>
      <Box
        data-drag-handle={true}
        sx={{
          width: "100%",
          height: "100%",
          background: "black",
          boxShadow: 3,
        }}
      >
        <ImageBlockContent
          onImageLoad={onImageLoad}
          contentData={(frameContentData as unknown) as ImageBlockParams}
        />
        <FloatingFrameControlBar />
      </Box>
    </Grow>
  )
}

export default ImageBlock
