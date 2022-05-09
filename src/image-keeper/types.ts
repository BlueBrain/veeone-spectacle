import { Size } from "../common/types"

export interface KeeperImage {
  objectUrl: string
  size: Size
}

export interface ImageKeeperResponse {
  imageId: string
  keeperImage: KeeperImage
}
