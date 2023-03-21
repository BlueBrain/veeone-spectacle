import React, { useContext } from "react"
import { SpectaclePresentation } from "../types"
import { Position, Size } from "../common/types"
import VeeDriveService from "../veedrive"
import {
  AddFramePayload,
  BringFrameToFrontPayload,
  CloseFramePayload,
  ManipulateFramePayload,
  ResizePresentationPayload,
  SendFrameToBackPayload,
  UpdateFrameDataPayload,
} from "./types"
import { RunningEnvironment } from "../config/types"

export interface SavePresentationOpenModalProps {
  position: Position
}

export enum ViewMode {
  Desk,
  SceneOverview,
}

export interface ThumbnailRegistryItem {
  size: Size
  objectUrl: string
}

export interface SpectacleStateContextProps {
  isPresentationClean: boolean
  isOnline: boolean
  viewMode: ViewMode
  setViewMode(newViewMode: ViewMode): void
  presentationStore: SpectaclePresentation
  presentationName: string
  updatePresentationStore: (
    callback: (state: SpectaclePresentation) => SpectaclePresentation
  ) => void
  veeDriveService: VeeDriveService
  thumbnailRegistry: { [key: string]: ThumbnailRegistryItem }
  addThumbnailToRegistry(path: string, thumbnail: ThumbnailRegistryItem): void
  addFrame: (payload: AddFramePayload) => void
  manipulateFrame: (payload: ManipulateFramePayload) => void
  updateFrameData: (payload: UpdateFrameDataPayload) => void
  bringFrameToFront: (payload: BringFrameToFrontPayload) => void
  sendFrameToBack: (payload: SendFrameToBackPayload) => void
  deactivateAllFrames: () => void
  closeFrame: (payload: CloseFramePayload) => void
  closeAllFrames: () => void
  loadPresentationStore: (newStore: SpectaclePresentation) => void
  savePresentationStore: (newStore: SpectaclePresentation) => void
  resizePresentation: (payload: ResizePresentationPayload) => void
}

const SpectacleStateContext = React.createContext<SpectacleStateContextProps>(
  null
)

export const useSpectacle = () => useContext(SpectacleStateContext)

export default SpectacleStateContext
