import { Position, Size } from "../common/types"
import BaseOpener from "./openers/base-opener"
import ImageOpener from "./openers/image-opener"
import MovieOpener from "./openers/video-opener"
import PDFOpener from "./openers/pdf-opener"

type OpenerRegistry = Record<string, typeof BaseOpener>

class FileOpenerService {
  private readonly openerRegistry: OpenerRegistry

  constructor() {
    this.openerRegistry = {}
  }

  public async handleFile(
    filePath: string,
    position: Position,
    defaultSize: Size,
    addFrameCallback,
    bringFrameToFrontCallback
  ) {
    const openerClass = this.handleFileByExtension(filePath)
    const opener = new openerClass({
      filePath,
      position,
    })
    opener.makeFrame(defaultSize, addFrameCallback, bringFrameToFrontCallback)
  }

  private handleFileByExtension(filePath: string) {
    const fileExtension = filePath.split(".").pop() ?? ""
    return this.getOpenerClass(fileExtension)
  }

  private getOpenerClass(fileExtension: string) {
    return this.openerRegistry[fileExtension.toLowerCase()]
  }

  public registerOpener(openerClass: typeof BaseOpener, extensions: string[]) {
    extensions.forEach(ext => {
      this.openerRegistry[ext.toLowerCase()] = openerClass
    })
  }

  public getSupportedFileExtensions() {
    return Object.keys(this.openerRegistry)
  }

  public doesSupportFileExtension(extension: string) {
    return this.getSupportedFileExtensions().includes(extension.toLowerCase())
  }
}

const fileOpenerService = new FileOpenerService()

fileOpenerService.registerOpener(ImageOpener, [
  "jpg",
  "jpeg",
  "png",
  "bmp",
  "gif",
  "webp",
])

fileOpenerService.registerOpener(MovieOpener, [
  "mp4",
  "mov",
  "avi",
  "mpg",
  "mpeg",
  "webm",
  "mkv",
])

fileOpenerService.registerOpener(PDFOpener, ["pdf"])

export default fileOpenerService
