import React from "react"
import { NotImplementedError } from "../../common/errors"
import { SpectaclePresentation } from "../types"
import { VeeDriveListPresentationsResponse } from "../../veedrive/types"

interface SavePresentationContextProps {
  isModalOpen: boolean
  openModal: () => void
  closeModal: (event, reason: string) => void
  save: (data: Partial<SpectaclePresentation>) => void
}

interface LoadPresentationContextProps {
  isModalOpen: boolean
  openModal: () => void
  closeModal: (event, reason: string) => void
  listPresentations: () => Promise<VeeDriveListPresentationsResponse>
  load: (id: string) => Promise<SpectaclePresentation>
}

export interface SpectacleContextProps {
  savePresentation: SavePresentationContextProps
  loadPresentation: LoadPresentationContextProps
}

export const SpectacleContext = React.createContext<SpectacleContextProps>({
  savePresentation: {
    isModalOpen: false,
    openModal: () => {
      throw new NotImplementedError()
    },
    closeModal: () => {
      throw new NotImplementedError()
    },
    save: () => {
      throw new NotImplementedError()
    },
  },
  loadPresentation: {
    isModalOpen: false,
    openModal: () => {
      throw new NotImplementedError()
    },
    closeModal: () => {
      throw new NotImplementedError()
    },
    listPresentations: () => {
      throw new NotImplementedError()
    },
    load: () => {
      throw new NotImplementedError()
    },
  },
})
