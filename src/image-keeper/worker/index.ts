import VeeDriveService from "../../veedrive"
import { KeeperImage } from "../types"

let veeDriveService: VeeDriveService

class ImageKeeperWorker {
  private readonly imageCache: Map<string, KeeperImage>

  veeDriveService: VeeDriveService

  constructor() {
    this.imageCache = new Map()
  }

  saveImageInCache = (path: string, objectUrl: string) => {
    this.imageCache[path] = { objectUrl }
    return this.imageCache[path]
  }

  getImageFromCache = (path: string): KeeperImage | null => {
    if (Object.keys(this.imageCache).includes(path)) {
      return this.imageCache[path]
    }
    return null
  }

  onmessage = (message: MessageEvent) => {
    console.debug("Message received in webworker...", message)
    const actionName = message.data.action
    if (actionName && Object.keys(this.messageHandlers).includes(actionName)) {
      this.messageHandlers[message.data.action](message.data.params)
    } else {
      console.error(`Action ${actionName} is not handled by the worker.`)
    }
  }

  handleInit = ({ wsPath }) => {
    console.debug("Initializing worker...")
    this.veeDriveService = new VeeDriveService(wsPath)
    console.debug("veedrive service created", veeDriveService)
  }

  fetchNewBlob = async path => {
    const response = await this.veeDriveService.requestFile({ path })
    console.debug("Got response from worker VeeDrive", response)
    const { url } = response
    const fileResponse = await fetch(url, {})
    return await fileResponse.blob()
  }

  getImageObjectUrl = async ({ path }): Promise<KeeperImage> => {
    let image = this.getImageFromCache(path)
    if (image) {
      return image
    } else {
      const blob = await this.fetchNewBlob(path)
      image = this.saveImageInCache(path, URL.createObjectURL(blob))
    }
    return image
  }

  handleRequestImage = async ({ path, imageId }) => {
    const keeperImage = await this.getImageObjectUrl({ path })
    postMessage({
      name: "imageReady",
      imageId,
      keeperImage,
    })
  }

  messageHandlers = {
    init: this.handleInit,
    requestImage: this.handleRequestImage,
  }
}

const api = new ImageKeeperWorker()

onmessage = api.onmessage

console.debug("First worker imported!")
