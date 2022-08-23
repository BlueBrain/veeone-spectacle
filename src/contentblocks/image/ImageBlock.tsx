import React, { useContext, useEffect, useMemo, useState } from "react"
import { ContentBlockProps } from "../types"
import { Box, Grow } from "@mui/material"
import FloatingFrameControlBar from "../../frames/FloatingFrameControlBar"
import ImageBlockContent from "./ImageBlockContent"
import { FrameContext } from "../../frames"
import { KeeperImage } from "../../image-keeper/types"

const ImageBlock: React.FC<ContentBlockProps> = props => {
  const [aspectRatio, setAspectRatio] = useState(1)
  const { updateAspectRatio } = useContext(FrameContext)

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
          contentData={props.contentData}
          onImageLoad={onImageLoad}
        />
        <FloatingFrameControlBar />
      </Box>
    </Grow>
  )
}

export default ImageBlock
