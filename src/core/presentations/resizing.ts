import { SpectaclePresentation } from "../types"
import { Size } from "../../common/types"
import { cloneDeep, round } from "lodash"
import { ContentBlockTypes } from "../../contentblocks/types"

export const resizePresentationStore = (
  store: SpectaclePresentation,
  targetSize: Size,
  minFrameLongSide: number,
  maxFrameLongSide: number,
  fileBrowserSize: Size
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
      const aspectRatio = round(
        frame.situation.width / frame.situation.height,
        3
      )
      const isHorizontal = aspectRatio >= 1
      let width = frame.situation.width * scaleRatio
      let height = frame.situation.height * scaleRatio

      // Guard the minimum long side size
      if (isHorizontal && width < minFrameLongSide) {
        width = minFrameLongSide
        height = width / aspectRatio
      } else if (!isHorizontal && height < minFrameLongSide) {
        height = minFrameLongSide
        width = height * aspectRatio
      }

      // Guard the maximum long side size
      if (isHorizontal && width > maxFrameLongSide) {
        width = maxFrameLongSide
        height = width / aspectRatio
      } else if (!isHorizontal && height > maxFrameLongSide) {
        height = maxFrameLongSide
        width = height * aspectRatio
      }

      if (frame.type === ContentBlockTypes.FileBrowser) {
        width = fileBrowserSize.width
        height = fileBrowserSize.height
      }

      let left = round(
        frame.situation.left * scaleRatio + extraHorizontalSpace / 2
      )
      let top = round(frame.situation.top * scaleRatio + extraVerticalSpace / 2)
      width = round(width)
      height = round(height)
      frame.situation = {
        ...frame.situation,
        width,
        height,
        left,
        top,
      }
    })
  })

  return newStore
}
