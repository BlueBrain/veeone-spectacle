import React, { useCallback, useMemo } from "react"
import { Box, Button } from "@mui/material"
import { ChevronLeftRounded, ChevronRightRounded } from "@mui/icons-material"
import { useFrame } from "../../frames/FrameContext"

interface PageNavigationProps {
  pageNumber: number
  maxPageNumber: number
  setPageNumber: (newPageNumber) => void
}

const buttonSx = {
  background: "#303030",
  opacity: "0.6",
  color: "white",
  ":hover": {
    background: "#303030",
    opacity: "1.0",
  },
  "&.Mui-disabled": {
    opacity: "0.1",
  },
  ".MuiSvgIcon-root": {
    width: "4rem",
    height: "4rem",
  },
}

const PageNavigation: React.FC<PageNavigationProps> = ({
  pageNumber,
  maxPageNumber,
  setPageNumber,
}) => {
  const { isTopFrame } = useFrame()

  const canGoNext = useMemo(() => pageNumber < maxPageNumber, [
    maxPageNumber,
    pageNumber,
  ])

  const canGoBack = useMemo(() => pageNumber > 1, [pageNumber])

  const goToPreviousPage = useCallback(() => {
    canGoBack && setPageNumber(pageNumber - 1)
  }, [canGoBack, pageNumber, setPageNumber])

  const goToNextPage = useCallback(() => {
    canGoNext && setPageNumber(pageNumber + 1)
  }, [canGoNext, pageNumber, setPageNumber])

  return (
    <Box
      sx={{
        position: "absolute",
        transition: "left ease 300ms, width ease 300ms",
        top: "0",
        left: isTopFrame ? "0" : "-5rem",
        width: isTopFrame ? "100%" : "calc(100% + 10rem)",
        height: "100%",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          transform: "translateY(-50%)",
          top: "50%",
          display: "flex",
          flexFlow: "row nowrap",
          justifyContent: "space-between",
          width: "100%",
          height: "40%",
        }}
      >
        <Button onClick={goToPreviousPage} disabled={!canGoBack} sx={buttonSx}>
          <ChevronLeftRounded />
        </Button>
        <Button onClick={goToNextPage} disabled={!canGoNext} sx={buttonSx}>
          <ChevronRightRounded />
        </Button>
      </Box>
      <Box
        sx={{
          position: "absolute",
          bottom: "0%",
          right: "0%",
          background: "#303030",
          opacity: "0.6",
          padding: "1rem",
          color: "white",
        }}
      >
        {pageNumber} / {maxPageNumber}
      </Box>
    </Box>
  )
}

export default PageNavigation
