import { ContentBlockTypes } from "../../contentblocks/types"
import BaseOpener from "./base-opener"

export default class PDFOpener extends BaseOpener {
  public readonly contentBlockType = ContentBlockTypes.PDF
}
