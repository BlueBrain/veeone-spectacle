import { Folder } from "@mui/icons-material"
import React, { useMemo, useRef } from "react"
import { useFileBrowserNavigator } from "./FileBrowserNavigatorContext"
import { BrowserDirectory } from "../../veedrive/common/models"
import useInteractable from "../../interactable/useInteractable"
import { Box } from "@mui/material"
import makeEllipsis, { EllipsisPosition } from "../../common/text/makeEllipsis"

interface FolderElementProps {
  dir: BrowserDirectory
}
const DirectoryElement: React.FC<FolderElementProps> = ({ dir }) => {
  const { navigateDirectory } = useFileBrowserNavigator()
  const ref = useRef()

  useInteractable(ref, {
    onTap: () => navigateDirectory(dir.path),
  })

  const dirNameEllipsis = useMemo(
    () =>
      makeEllipsis(dir.name, {
        ellipsisPosition: EllipsisPosition.MIDDLE,
        visibleCharacters: 20,
      }),
    [dir.name]
  )

  return (
    <Box title={dir.name} key={dir.path} ref={ref}>
      <Box className={"Thumbnail"}>
        <Box className={"ThumbnailBody"}>
          <Folder fontSize={"large"} sx={{ fill: "url(#linearColors)" }} />
        </Box>
      </Box>
      <Box className={"Label"}>{dirNameEllipsis}</Box>
    </Box>
  )
}

export default DirectoryElement
