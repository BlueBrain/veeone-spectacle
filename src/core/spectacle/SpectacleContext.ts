import React, { useContext } from "react"
import { SceneId, SpectaclePresentation } from "../types"
import { VeeDriveListPresentationsResponse } from "../../veedrive/types"
import { Position, Size } from "../../common/types"
import SceneManager from "../scenes/SceneManager"
import VeeDriveService from "../../veedrive"

export interface SavePresentationOpenModalProps {
  position: Position
}

interface OpenPresentationOpenModalProps {
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

export interface SpectacleContextProps {
  isPresentationClean: boolean
  viewMode: ViewMode
  setViewMode(newViewMode: ViewMode): void
  sceneManager: SceneManager
  activeSceneId: SceneId
  nextSceneId: SceneId
  previousSceneId: SceneId
  activeSceneIndex: number
  sceneIds: SceneId[]
  presentationStore: SpectaclePresentation
  veeDriveService: VeeDriveService
  thumbnailRegistry: { [key: string]: ThumbnailRegistryItem }
  addThumbnailToRegistry(path: string, thumbnail: ThumbnailRegistryItem): void
}

const SpectacleContext = React.createContext<SpectacleContextProps>(null)

export const useSpectacle = () => useContext(SpectacleContext)

export default SpectacleContext
