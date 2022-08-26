import { createContext, useContext } from "react"
import { SpectaclePresentation } from "../../types"
import { Position } from "../../common/types"

export interface ModalProps {
  position: Position
}

export interface PresentationManagerContextProps {
  newPresentation: (props: ModalProps) => Promise<SpectaclePresentation>
  openPresentation: (props: ModalProps) => Promise<SpectaclePresentation>
  savePresentation: (props: ModalProps) => Promise<SpectaclePresentation>
  savePresentationAs: (props: ModalProps) => Promise<SpectaclePresentation>
  folderList: string[]
  loadFolderList: () => Promise<string[]>
  createFolder: (folderName: string) => Promise<any>
  removeFolder: (folderName: string) => Promise<any>
}

export const PresentationManagerContext = createContext<PresentationManagerContextProps>(
  null
)

export const usePresentationManager = () =>
  useContext(PresentationManagerContext)

export default PresentationManagerContext
