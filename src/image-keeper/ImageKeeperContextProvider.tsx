import React, { useCallback, useEffect, useMemo } from "react"
import ImageKeeperContext, {
  ImageKeeperContextProps,
} from "./ImageKeeperContext"
import { useConfig } from "../config/AppConfigContext"
import { generateRandomId } from "../common/random"
import { ImageKeeperResponse } from "./types"
import { useSpectacle } from "../spectacle/SpectacleStateContext"

const ImageKeeperContextProvider: React.FC = ({ children }) => {
  const config = useConfig()
  const { presentationStore } = useSpectacle()

  const globalImageWorker = useMemo(() => {
    return new Worker(
      new URL(
        "./workers/image-keeper-worker",
        // @ts-ignore
        import.meta.url
      )
    )
  }, [])

  const imageWorker = useMemo(
    () =>
      config.IMAGE_KEEPER_AS_SINGLE_WORKER
        ? globalImageWorker
        : new Worker(
            new URL(
              "./workers/image-keeper-worker",
              // @ts-ignore
              import.meta.url
            )
          ),
    [config.IMAGE_KEEPER_AS_SINGLE_WORKER, globalImageWorker]
  )

  const requestImage = useCallback(
    (path: string): Promise<ImageKeeperResponse> => {
      return new Promise(resolve => {
        const imageId = generateRandomId()
        const handleImageRequest = message => {
          if (message.data.imageId === imageId) {
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
    [config.VEEDRIVE_WS_PATH, imageWorker]
  )

  const providerValue = useMemo<ImageKeeperContextProps>(
    () => ({
      requestImage,
    }),
    [requestImage]
  )

  useEffect(() => {
    // Reset image cache when presentation changes (id)
    imageWorker.postMessage({
      action: "clearImageCache",
    })
  }, [presentationStore.createdAt])

  return (
    <ImageKeeperContext.Provider value={providerValue}>
      {children}
    </ImageKeeperContext.Provider>
  )
}

export default ImageKeeperContextProvider
