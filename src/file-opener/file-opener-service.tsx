import { Position } from "../common/types"
import BaseOpener from "./openers/base-opener"
import ImageOpener from "./openers/image-opener"
import MovieOpener from "./openers/video-opener"

type OpenerRegistry = Record<string, typeof BaseOpener>

class FileOpenerService {
  // determine file type and proxy to content opener

  private readonly openerRegistry: OpenerRegistry

  constructor() {
    this.openerRegistry = {}
  }

  public async handleFile(filePath: string, referencePosition: Position) {
    const openerClass = this.handleFileByExtension(filePath)
    const opener = new openerClass({
      filePath,
      position: referencePosition,
    })
    opener.makeFrame()
  }

  private handleFileByExtension(filePath: string) {
    const fileExtension = filePath.split(".").pop() ?? ""
    return this.getOpenerClass(fileExtension)
  }

  private getOpenerClass(fileExtension: string) {
    return this.openerRegistry[fileExtension.toLowerCase()]
  }

  public registerOpener(openerClass: typeof BaseOpener, extensions: string[]) {
    extensions.forEach((ext, i) => {
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
fileOpenerService.registerOpener(ImageOpener, ["jpg", "png", "bmp", "gif"])
fileOpenerService.registerOpener(MovieOpener, [
  "mp4",
  "mov",
  "avi",
  "mpg",
  "mpeg",
])
export default fileOpenerService
