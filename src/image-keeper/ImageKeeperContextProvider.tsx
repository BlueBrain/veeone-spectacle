import React, { useCallback, useMemo } from "react"
import ImageKeeperContext, {
  ImageKeeperContextProps,
} from "./ImageKeeperContext"
import { useConfig } from "../config/AppConfigContext"
import { generateRandomId } from "../common/random"
import { ImageKeeperResponse } from "./types"

const globalWorker = new Worker(
  new URL(
    "./workers/image-keeper-worker",
    // @ts-ignore
    import.meta.url
  )
)

const ImageKeeperContextProvider: React.FC = ({ children }) => {
  const config = useConfig()

  const globalImageWorker = useMemo(() => {
    console.log("create new globalImageWorker instance")
    return globalWorker
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
      console.log("Request new image", path)
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

  return (
    <ImageKeeperContext.Provider value={providerValue}>
      {children}
    </ImageKeeperContext.Provider>
  )
}

export default ImageKeeperContextProvider
