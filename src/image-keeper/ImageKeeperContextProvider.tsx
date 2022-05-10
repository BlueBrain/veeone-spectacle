import React, { useCallback, useEffect, useMemo } from "react"
import ImageKeeperContext, {
  ImageKeeperContextProps,
} from "./ImageKeeperContext"
import { useConfig } from "../config/AppConfigContext"
import { generateRandomId } from "../common/random"
import { ImageKeeperResponse } from "./types"

const ImageKeeperContextProvider: React.FC = ({ children }) => {
  const config = useConfig()

  const imageWorker = useMemo(
    () =>
      // @ts-ignore
      new Worker(new URL("./worker", import.meta.url)),
    []
  )

  const requestImage = useCallback(
    (path: string): Promise<ImageKeeperResponse> => {
      return new Promise(resolve => {
        const imageId = generateRandomId()

        const handleImageRequest = message => {
          console.debug("Received message in ContextProvider", message)
          if (message.data.imageId === imageId) {
            console.debug("Received image blob!", imageId)
            imageWorker.removeEventListener("message", handleImageRequest)
            resolve(message.data as ImageKeeperResponse)
          }
        }

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
    [imageWorker]
  )

  useEffect(() => {
    imageWorker.postMessage({
      action: "init",
      params: { wsPath: config.VEEDRIVE_WS_PATH },
    })
  }, [config, imageWorker])

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
