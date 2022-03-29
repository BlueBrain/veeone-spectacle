import { SpectaclePresentation } from "../types"
import { Size } from "../../common/types"
import { config } from "../../config"

export const adjustPresentationToViewport = (store: SpectaclePresentation) =>
  resizePresentationStore(store, {
    width: config.VIEWPORT_WIDTH,
    height: config.VIEWPORT_HEIGHT,
  })

export const resizePresentationStore = (
  store: SpectaclePresentation,
  targetSize: Size
) => {
  const newStore = { ...store }
  // todo apply resizing...
  return newStore
}
