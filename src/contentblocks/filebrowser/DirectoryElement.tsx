import { Folder } from "@mui/icons-material"
import React, { useRef } from "react"
import { useFileBrowserNavigator } from "./FileBrowserNavigatorContext"
import { BrowserDirectory } from "../../veedrive/common/models"
import useInteractable from "../../core/interactable/useInteractable"
import { Box } from "@mui/material"

interface FolderElementProps {
  dir: BrowserDirectory
}
const DirectoryElement: React.FC<FolderElementProps> = ({ dir }) => {
  const { navigateDirectory } = useFileBrowserNavigator()
  const ref = useRef()

  useInteractable(ref, {
    onTap: () => navigateDirectory(dir.path),
  })

  return (
    <Box title={dir.name} key={dir.path} ref={ref}>
      <Box className={"Thumbnail"}>
        <Box className={"ThumbnailBody"}>
          <Folder fontSize={"large"} />
        </Box>
      </Box>
      <Box className={"Label"}>{dir.name}</Box>
    </Box>
  )
}

export default DirectoryElement
