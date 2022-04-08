import React, { useCallback, useEffect, useMemo, useRef, useState } from "react"
import VeeDriveService from "../../veedrive"
import { BrowserFile } from "../../veedrive/common/models"
import { useFileBrowserNavigator } from "./FileBrowserNavigatorContext"
import { InsertDriveFile } from "@mui/icons-material"
import { useFileBrowserSelectionMode } from "./selection-mode/FileBrowserSelectionModeContext"
import interact from "interactjs"
import FileThumbnailSelected from "./selection-mode/FileThumbnailSelected"
import { Box } from "@mui/material"
import makeEllipsis, { EllipsisPosition } from "../../common/text/makeEllipsis"
import { useConfig } from "../../config/AppConfigContext"

interface FileElementProps {
  file: BrowserFile
}

const FileElement: React.FC<FileElementProps> = ({ file }) => {
  const ref = useRef()
  const config = useConfig()
  const veeDriveService = useMemo(() => new VeeDriveService(config), [config])
  const [thumbnailUrl, setThumbnailUrl] = useState("")
  const { requestFile } = useFileBrowserNavigator()
  const {
    isFileSelected,
    isSelectionModeEnabled,
    toggleSelectionMode,
    toggleFileSelect,
    selectFile,
  } = useFileBrowserSelectionMode()

  useEffect(() => {
    let isMounted = true
    const loadThumbnail = async () => {
      const response = await veeDriveService.requestFile({
        path: file.path,
      })
      if (response !== undefined && !!response.thumbnail) {
        if (isMounted) {
          setThumbnailUrl(response.thumbnail)
        }
      }
    }
    void loadThumbnail()
    return () => {
      isMounted = false
    }
  }, [file.path, veeDriveService])

  const isSelected = useMemo<boolean>(() => {
    return isFileSelected(file.path)
  }, [file.path, isFileSelected])

  const handleTap = useCallback(
    event => {
      if (isSelectionModeEnabled) {
        toggleFileSelect(file.path)
      } else {
        requestFile(file.path)
      }
      event.stopPropagation()
    },
    [file.path, isSelectionModeEnabled, requestFile, toggleFileSelect]
  )

  const handleHold = useCallback(
    event => {
      const selectionModeEnabled = toggleSelectionMode()
      if (selectionModeEnabled) {
        selectFile(file.path)
      }
    },
    [file.path, selectFile, toggleSelectionMode]
  )

  useEffect(() => {
    const currentRef = ref.current
    if (currentRef) {
      interact(currentRef)
        .pointerEvents({
          holdDuration: 400,
        })
        .on("tap", handleTap)
        .on("hold", handleHold)
    }
    return () => {
      interact(currentRef).unset()
    }
  }, [handleHold, handleTap])

  const fileNameEllipsis = useMemo(
    () =>
      makeEllipsis(file.name, {
        ellipsisPosition: EllipsisPosition.MIDDLE,
        visibleCharacters: 20,
      }),
    [file.name]
  )

  return (
    <Box
      title={file.name}
      ref={ref}
      className={"FileElement"}
      sx={{
        position: "relative",
      }}
    >
      <Box className={"Thumbnail"}>
        <Box className={"ThumbnailBody"}>
          {thumbnailUrl ? (
            <Box
              component={"img"}
              loading={"lazy"}
              src={thumbnailUrl}
              sx={{
                display: "flex",
                maxWidth: "100%",
                maxHeight: "100%",
                objectFit: "contain",
                opacity: 0.8,
                boxShadow: 1,
              }}
            />
          ) : (
            <InsertDriveFile fontSize={"large"} />
          )}
        </Box>
        <FileThumbnailSelected isSelected={isSelected} />
      </Box>
      <Box className={"Label FileThumbnailLabel"}>{fileNameEllipsis}</Box>
    </Box>
  )
}
export default FileElement
