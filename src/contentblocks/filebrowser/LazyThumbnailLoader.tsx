import React, { useContext, useEffect, useMemo, useRef, useState } from "react"
import { FileBrowserContext } from "./FileBrowserContext"
import _ from "lodash"
import { CircularProgress } from "@mui/material"

const LazyThumbnailLoader: React.FC = ({ children }) => {
  const { scrollableAreaRef } = useContext(FileBrowserContext)
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  const placeholder = <CircularProgress />

  const handleThumbnailVisibility = useMemo(() => {
    return _.throttle(() => {
      const currentRect = ref.current.getBoundingClientRect()
      const parentRect = scrollableAreaRef.getBoundingClientRect()
      const distance = parentRect.bottom - currentRect.top
      console.debug(
        "scroll handler...",
        currentRect.top,
        parentRect.bottom,
        "distance=",
        distance
      )
      if (distance > 10) {
        setVisible(true)
      }
    }, 1000)
  }, [scrollableAreaRef])

  useEffect(() => {
    const currentReference = ref.current
    if (scrollableAreaRef) {
      console.debug("Init Lazy loader", currentReference)
      scrollableAreaRef.addEventListener(
        "scroll",
        handleThumbnailVisibility,
        false
      )
    }
    handleThumbnailVisibility()
    return () => {
      console.debug("Destroy Lazy loader")
      scrollableAreaRef.removeEventListener("scroll", handleThumbnailVisibility)
    }
  }, [handleThumbnailVisibility, scrollableAreaRef])

  return <div ref={ref}>{visible ? children : placeholder}</div>
}

export default LazyThumbnailLoader
