import { Json } from "../../common/types"

export interface WebsiteBlockContentData {
  [key: string]: Json

  websiteUrl: string
  isInteractiveModeOn: boolean
}
