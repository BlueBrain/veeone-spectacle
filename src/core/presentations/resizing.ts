import { SpectaclePresentation } from "../types"
import { Size } from "../../common/types"
import { config } from "../../config"
import { cloneDeep, round } from "lodash"

export const adjustPresentationToViewport = (store: SpectaclePresentation) =>
  resizePresentationStore(store, {
    width: config.VIEWPORT_WIDTH,
    height: config.VIEWPORT_HEIGHT,
  })

export const resizePresentationStore = (
  store: SpectaclePresentation,
  targetSize: Size
): SpectaclePresentation => {
  const newStore = cloneDeep(store)
  newStore.meta.viewport = { ...targetSize }

  const { width: newWidth, height: newHeight } = targetSize
  const { width: oldWidth, height: oldHeight } = store.meta.viewport
  const widthRatio = round(newWidth / oldWidth, 2)
  const heightRatio = round(newHeight / oldHeight, 2)
  const scaleRatio = Math.min(widthRatio, heightRatio)

  const extraHorizontalSpace = newWidth - oldWidth * scaleRatio
  const extraVerticalSpace = newHeight - oldHeight * scaleRatio

  Object.entries(newStore.scenes.scenes).forEach(([sceneId, scene]) => {
    Object.entries(scene.frames).forEach(([frameId, frame]) => {
      frame.situation.width *= scaleRatio
      frame.situation.height *= scaleRatio
      frame.situation.left = round(
        frame.situation.left * scaleRatio + extraHorizontalSpace / 2
      )
      frame.situation.top = round(
        frame.situation.top * scaleRatio + extraVerticalSpace / 2
      )
    })
  })

  return newStore
}
