import { ContentBlockTypes } from "../../contentblocks/types"
import BaseOpener from "./base-opener"

export default class MovieOpener extends BaseOpener {
  public readonly contentBlockType = ContentBlockTypes.Video
}
