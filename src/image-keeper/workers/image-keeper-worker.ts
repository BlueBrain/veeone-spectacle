import VeeDriveService from "../../veedrive"
import { KeeperImage } from "../types"
import { Size } from "../../common/types"

let veeDriveService: VeeDriveService

class ImageKeeperWorker {
  private readonly imageCache: Map<string, KeeperImage>
  private isReady: boolean = false

  veeDriveService: VeeDriveService

  constructor() {
    this.imageCache = new Map()
  }

  resetImageCache = () => {
    this.imageCache.clear()
  }

  saveImageInCache = (path: string, objectUrl: string, size: Size) => {
    this.imageCache[path] = { objectUrl, size } as KeeperImage
    return this.imageCache[path]
  }

  getImageFromCache = (path: string): KeeperImage | null => {
    if (Object.keys(this.imageCache).includes(path)) {
      return this.imageCache[path]
    }
    return null
  }

  onmessage = (message: MessageEvent) => {
    const actionName = message.data.action
    if (actionName && Object.keys(this.messageHandlers).includes(actionName)) {
      this.messageHandlers[message.data.action](message.data.params)
    } else {
    }
  }

  handleInit = ({ wsPath }) => {
    if (this.isReady) {
      return
    }
    this.veeDriveService = new VeeDriveService(wsPath)
    this.isReady = true
  }

  fetchNewBlob = async path => {
    const response = await this.veeDriveService.requestFile({ path })
    const { url } = response
    const fileResponse = await fetch(url, {})
    return await fileResponse.blob()
  }

  getKeeperImage = async ({ path }): Promise<KeeperImage> => {
    let keeperImage = this.getImageFromCache(path)
    if (!keeperImage) {
      const blob = await this.fetchNewBlob(path)
      const keeperImageSrc = URL.createObjectURL(blob)
      const bitmap = await createImageBitmap(blob)
      keeperImage = this.saveImageInCache(path, keeperImageSrc, {
        width: bitmap.width,
        height: bitmap.height,
      })
    }
    return keeperImage
  }

  handleRequestImage = async ({ path, imageId }) => {
    const keeperImage = await this.getKeeperImage({ path })
    postMessage({
      name: "imageReady",
      imageId,
      keeperImage,
    })
  }

  messageHandlers = {
    init: this.handleInit,
    requestImage: this.handleRequestImage,
    clearImageCache: this.resetImageCache,
  }
}

const api = new ImageKeeperWorker()

onmessage = api.onmessage
