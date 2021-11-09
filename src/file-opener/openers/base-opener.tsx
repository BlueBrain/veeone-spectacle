import { Position } from "../../common/types"
import { ContentBlockTypes } from "../../contentblocks/types"
import { FrameData, FrameId } from "../../core/scenes/interfaces"
import { generateFrameId } from "../../core/frames/utils"
import { spectacleStore } from "../../core/redux/store"
import { addFrame, bringFrameToFront } from "../../core/redux/actions"
import { NotImplementedError } from "../../common/errors"
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

  public makeFrame() {
    spectacleStore.dispatch(
      addFrame({
        type: this.contentBlockType,
        frameId: this.frameId,
        position: this.position,
        contentData: {
          path: this.filePath,
          ...this.getContentData(),
        },
      })
    )
    setTimeout(() => spectacleStore.dispatch(bringFrameToFront(this.frameId)))
  }

  public getContentData(): FrameData {
    return {}
  }
}
