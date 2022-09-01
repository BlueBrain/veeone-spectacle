import { Position } from "../../common/types"
import { ContentBlockTypes } from "../../contentblocks/types"
import { FrameData, FrameId } from "../../types"
import { generateFrameId } from "../../frames/utils"

interface OpenerProps {
  filePath: string
  position: Position
}

export default class BaseOpener {
  private readonly filePath: string
  private readonly position: Position
  public readonly contentBlockType: ContentBlockTypes
  private readonly frameId: FrameId

  constructor(props: OpenerProps) {
    this.filePath = props.filePath
    this.position = props.position
    this.frameId = generateFrameId()
  }

  public makeFrame(defaultSize, addFrame, bringFrameToFront) {
    addFrame({
      type: this.contentBlockType,
      frameId: this.frameId,
      position: this.position,
      size: defaultSize,
      contentData: {
        path: this.filePath,
        ...this.getContentData(),
      },
    })
    setTimeout(() => bringFrameToFront(this.frameId))
  }

  public getContentData(): FrameData {
    return {}
  }
}
