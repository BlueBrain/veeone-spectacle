import React, { useContext, useEffect, useState } from "react"
import { ContentBlockProps } from "../types"
import { Box, Grow } from "@mui/material"
import FloatingFrameControlBar from "../../core/frames/FloatingFrameControlBar"
import ImageBlockContent from "./ImageBlockContent"
import { Size } from "../../common/types"
import { FrameContext } from "../../core/frames"

const ImageBlock: React.FC<ContentBlockProps> = props => {
  const [imageSize, setImageSize] = useState<Size>({ width: 0, height: 0 })
  const { width, height } = imageSize
  const [aspectRatio, setAspectRatio] = useState(width / height)
  const { updateAspectRatio } = useContext(FrameContext)

  useEffect(() => {
    if (!isNaN(aspectRatio)) {
      updateAspectRatio(aspectRatio)
    }
  }, [aspectRatio, updateAspectRatio])

  const onImageLoad = ({ width, height }: HTMLImageElement) => {
    setAspectRatio(width / height)
  }

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
