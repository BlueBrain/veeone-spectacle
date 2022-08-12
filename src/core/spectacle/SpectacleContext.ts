import React, { useContext } from "react"
import { SceneId, SpectaclePresentation } from "../types"
import { VeeDriveListPresentationsResponse } from "../../veedrive/types"
import { Position, Size } from "../../common/types"
import SceneManager from "../scenes/SceneManager"
import VeeDriveService from "../../veedrive"

interface SavePresentationOpenModalProps {
  position: Position
}

interface SavePresentationContextProps {
  isModalOpen: boolean
  openModal: (props: SavePresentationOpenModalProps) => void
  closeModal: (event, reason: string) => void
  save: (data: Partial<SpectaclePresentation>) => void
}

interface OpenPresentationOpenModalProps {
  position: Position
}

interface OpenPresentationContextProps {
  isModalOpen: boolean
  openModal: (props: OpenPresentationOpenModalProps) => void
  closeModal: (event, reason: string) => void
  listPresentations: () => Promise<VeeDriveListPresentationsResponse>
  load: (id: string) => Promise<SpectaclePresentation>
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
  savePresentation: SavePresentationContextProps
  openPresentation: OpenPresentationContextProps
  openPresentationModalPosition: Position
  savePresentationModalPosition: Position
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
