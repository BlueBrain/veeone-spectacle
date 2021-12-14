import React from "react"
import { NotImplementedError } from "../../common/errors"

interface SavePresentationContextProps {
  isModalOpen: boolean
  openModal: () => void
  closeModal: (event, reason: string) => void
}

export interface SpectacleContextProps {
  savePresentation: SavePresentationContextProps
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
  },
})
