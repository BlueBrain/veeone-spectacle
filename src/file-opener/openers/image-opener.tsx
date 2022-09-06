import { ContentBlockTypes } from "../../contentblocks/types"
import BaseOpener from "./base-opener"

export default class ImageOpener extends BaseOpener {
  public readonly contentBlockType = ContentBlockTypes.Image
}
