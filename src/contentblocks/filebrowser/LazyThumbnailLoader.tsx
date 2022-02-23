import React, { useEffect, useMemo, useRef, useState } from "react"
import { useFileBrowser } from "./FileBrowserContext"
import _ from "lodash"
import { CircularProgress } from "@mui/material"

const LazyThumbnailLoader: React.FC = ({ children }) => {
  const { scrollableAreaRef } = useFileBrowser()
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  const placeholder = <CircularProgress />

  const handleThumbnailVisibility = useMemo(() => {
    return _.throttle(() => {
      const currentRect = ref.current.getBoundingClientRect()
      const parentRect = scrollableAreaRef.getBoundingClientRect()
      const distance = parentRect.bottom - currentRect.top
      if (distance > 10) {
        setVisible(true)
      }
    }, 1000)
  }, [scrollableAreaRef])

  useEffect(() => {
    const currentReference = ref.current
    if (scrollableAreaRef) {
      scrollableAreaRef.addEventListener(
        "scroll",
        handleThumbnailVisibility,
        false
      )
    }
    handleThumbnailVisibility()
    return () => {
      scrollableAreaRef.removeEventListener("scroll", handleThumbnailVisibility)
    }
  }, [handleThumbnailVisibility, scrollableAreaRef])

  return <div ref={ref}>{visible ? children : placeholder}</div>
}

export default LazyThumbnailLoader
