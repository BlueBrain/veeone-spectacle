import React, { useCallback, useEffect, useMemo, useState } from "react"
import { Box, Grow } from "@mui/material"
import FloatingFrameControlBar from "../../frames/FloatingFrameControlBar"
import { useFrame } from "../../frames/FrameContext"
import { PDFDocumentProxyProps, PDFReaderBlockParams } from "./types"
import { useSpectacle } from "../../spectacle/SpectacleStateContext"
import { Document, Page } from "react-pdf/dist/esm/entry.webpack5"

// @ts-ignore
import styles from "./PDFReaderBlock.module.scss"
import JSONRPCError from "../../errors/jsonrpcerror"
import { WarningRounded } from "@mui/icons-material"
import PageNavigation from "./PageNavigation"

const PDFReaderBlock: React.FC = () => {
  const { frameContentData, width, preventFullscreen } = useFrame()
  const { veeDriveService } = useSpectacle()
  const { path } = (frameContentData as any) as PDFReaderBlockParams
  const [fileUrl, setFileUrl] = useState<string>("")
  const [pageNumber, setPageNumber] = useState(1)
  const [maxPageNumber, setMaxPageNumber] = useState(1)
  const [hasFailure, setHasFailure] = useState(false)
  const [warningMessage, setWarningMessage] = useState(
    `There was a problem loading the file: ${path}`
  )

  useEffect(() => {
    preventFullscreen()
  }, [preventFullscreen])

  useEffect(() => {
    async function prepareFileUrl() {
      try {
        const response = await veeDriveService.requestFile({ path })
        setPageNumber(1)
        setFileUrl(response.url)
      } catch (e) {
        if (e instanceof JSONRPCError) {
          setHasFailure(true)
        }
      }
    }
    void prepareFileUrl()
  }, [path, veeDriveService])

  const handleLoadSuccess = useCallback((pdfDoc: PDFDocumentProxyProps) => {
    setMaxPageNumber(pdfDoc.numPages)
  }, [])

  const pdfViewerComponent = useMemo(
    () =>
      !hasFailure &&
      fileUrl && (
        <Document
          file={fileUrl}
          className={styles.Document}
          onLoadSuccess={handleLoadSuccess}
        >
          <Page
            className={styles.Page}
            pageNumber={pageNumber}
            width={width}
            renderAnnotationLayer={false}
            renderTextLayer={false}
          />
        </Document>
      ),
    [fileUrl, handleLoadSuccess, hasFailure, pageNumber, width]
  )

  const failureComponent = useMemo(
    () => (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          flexWrap: "normal",
          width: `100%`,
          height: `100%`,
          background: "gray",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        <WarningRounded sx={{ fontSize: "2rem" }} />
        <Box
          sx={{
            width: `70%`,
            wordBreak: "break-word",
          }}
        >
          {warningMessage}
        </Box>
      </Box>
    ),
    [warningMessage]
  )

  return (
    <Grow in={true}>
      <Box
        data-drag-handle={true}
        sx={{
          width: "100%",
          height: "100%",
          background: "white",
          boxShadow: 3,
        }}
      >
        <Box
          sx={{
            position: "relative",
            width: "100%",
            height: "100%",
            overflow: "hidden",
          }}
        >
          {!hasFailure ? pdfViewerComponent : failureComponent}
          <PageNavigation
            pageNumber={pageNumber}
            maxPageNumber={maxPageNumber}
            setPageNumber={setPageNumber}
          />
        </Box>
        <FloatingFrameControlBar />
      </Box>
    </Grow>
  )
}

export default PDFReaderBlock
