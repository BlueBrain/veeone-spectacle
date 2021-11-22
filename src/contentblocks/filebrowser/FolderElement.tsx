import { Folder } from "@mui/icons-material"
import React, { useContext, useRef } from "react"
import { FileBrowserContext } from "./FileBrowserContext"
import { BrowserDirectory, BrowserFile } from "../../veedrive/common/models"
import useInteractable from "../../core/interactable/useInteractable"

interface FolderElementProps {
  classes: any
  dir: BrowserDirectory
}
const FolderElement: React.FC<FolderElementProps> = ({ dir, classes }) => {
  const { navigateDirectory } = useContext(FileBrowserContext)
  const ref = useRef()

  useInteractable(ref, {
    onTap: () => navigateDirectory(dir.path),
  })

  return (
    <div className={classes.gridTile} title={dir.name} key={dir.path} ref={ref}>
      <div className={classes.gridTileThumbnail}>
        <div className={classes.gridTileThumbnailBody}>
          <Folder fontSize={"large"} className={classes.gridTileIcon} />
        </div>
      </div>
      <div className={classes.gridTileLabel}>{dir.name}</div>
    </div>
  )
}

export default FolderElement
