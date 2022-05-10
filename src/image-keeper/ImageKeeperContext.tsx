import { createContext, useContext } from "react"
import { ImageKeeperResponse } from "./types"

export interface ImageKeeperContextProps {
  requestImage(path: string): Promise<ImageKeeperResponse>
}

const ImageKeeperContext = createContext<ImageKeeperContextProps>(null)

export const useImageKeeper = () => useContext(ImageKeeperContext)

export default ImageKeeperContext
