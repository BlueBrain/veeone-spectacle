import React, { useContext, useState } from "react"
import { IconButton, Menu, MenuItem, Tooltip } from "@material-ui/core"
import { History } from "@material-ui/icons"
import { useSelector } from "react-redux"
import {
  FrameEntry,
  PresentationStateData,
} from "../../../core/presentations/interfaces"
import { getFrame } from "../../../core/redux/selectors"
import { FileBrowserBlockPayload } from "../../common/types"
import { FileBrowserContext } from "../../contexts/filebrowser-context"

interface BrowsingHistorySelectorProps {}

const BrowsingHistorySelector: React.FC<BrowsingHistorySelectorProps> = () => {
  const { navigateToIndex } = useContext(FileBrowserContext)
  const frameId = useContext(FileBrowserContext).frameId ?? ""
  const frameData = (useSelector<PresentationStateData>(state =>
    getFrame(state, frameId)
  ) as unknown) as FrameEntry

  // const situation = frameData.situation
  const blockData = (frameData.data as unknown) as FileBrowserBlockPayload

  // TODO make max history length setting configurable
  const history = blockData?.history?.slice(0, 10) ?? [""]

  const [
    viewTypeAnchorElement,
    setViewTypeAnchorElement,
  ] = useState<null | HTMLElement>(null)

  const openMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    setViewTypeAnchorElement(event.currentTarget)
  }

  const onCloseMenu = () => {
    setViewTypeAnchorElement(null)
  }

  const onSelectHistoryItem = (dirPath, index) => {
    navigateToIndex(index)
    onCloseMenu()
  }

  const shouldDisableButton = history.length <= 1

  return (
    <>
      <Tooltip title="Show recently visited folders">
        <IconButton onClick={openMenu} disabled={shouldDisableButton}>
          <History />
        </IconButton>
      </Tooltip>
      <Menu
        id="viewType"
        anchorEl={viewTypeAnchorElement}
        open={Boolean(viewTypeAnchorElement)}
        onClose={onCloseMenu}
      >
        {history.map((historyItem, index) => (
          <MenuItem
            key={index}
            onClick={() => onSelectHistoryItem(historyItem, index)}
          >
            {historyItem || "/"}
          </MenuItem>
        ))}
      </Menu>
    </>
  )
}

export default BrowsingHistorySelector
