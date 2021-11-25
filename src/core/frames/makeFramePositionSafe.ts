import { Position, Size } from "../../common/types"
import { config } from "../../config"

export const makeFramePositionSafe = (
  position: Position,
  size: Size
): Position => {
  console.debug("makeFramePositionSafe", position, size)
  const halfWidth = size.width / 2
  const halfHeight = size.height / 2
  const leftDistance = position.left - halfWidth
  const rightDistance = config.VIEWPORT_WIDTH - position.left - halfWidth
  const topDistance = position.top - halfHeight
  const bottomDistance = config.VIEWPORT_HEIGHT - position.top - halfHeight
  let newPosition = position
  if (leftDistance < 0) {
    newPosition.left = halfWidth
  }
  if (rightDistance < 0) {
    newPosition.left = config.VIEWPORT_WIDTH - halfWidth
  }
  if (topDistance < 0) {
    newPosition.top = halfHeight
  }
  if (bottomDistance < 0) {
    newPosition.top = config.VIEWPORT_HEIGHT - halfHeight
  }
  return { ...newPosition }
}
