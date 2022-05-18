import React, { useCallback, useMemo } from "react"
import ImageKeeperContext, {
  ImageKeeperContextProps,
} from "./ImageKeeperContext"
import { useConfig } from "../config/AppConfigContext"
import { generateRandomId } from "../common/random"
import { ImageKeeperResponse } from "./types"

const ImageKeeperContextProvider: React.FC = ({ children }) => {
  const config = useConfig()

  const globalImageWorker = useMemo(
    // @ts-ignore
    () => new Worker(new URL("./worker", import.meta.url)),
    []
  )

  const getImageWorker = useCallback(
    () =>
      config.IMAGE_KEEPER_SINGLE_WORKER
        ? globalImageWorker
        : // @ts-ignore
          new Worker(new URL("./worker", import.meta.url)),
    [config.IMAGE_KEEPER_SINGLE_WORKER, globalImageWorker]
  )

  const requestImage = useCallback(
    (path: string): Promise<ImageKeeperResponse> => {
      return new Promise(resolve => {
        const imageWorker = getImageWorker()
        const imageId = generateRandomId()
        const handleImageRequest = message => {
          console.debug("Received message in ContextProvider", message)
          if (message.data.imageId === imageId) {
            console.debug("Received image blob!", imageId)
            imageWorker.removeEventListener("message", handleImageRequest)
            resolve(message.data as ImageKeeperResponse)
          }
        }

        imageWorker.postMessage({
          action: "init",
          params: { wsPath: config.VEEDRIVE_WS_PATH },
        })

        imageWorker.addEventListener("message", handleImageRequest)

        imageWorker.postMessage({
          action: "requestImage",
          params: {
            imageId,
            path,
          },
        })
      })
    },
    [config.VEEDRIVE_WS_PATH, getImageWorker]
  )

  const providerValue = useMemo<ImageKeeperContextProps>(
    () => ({
      requestImage,
    }),
    [requestImage]
  )

  return (
    <ImageKeeperContext.Provider value={providerValue}>
      {children}
    </ImageKeeperContext.Provider>
  )
}

export default ImageKeeperContextProvider
