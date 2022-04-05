import { Position, Size } from "../../common/types"

export const makeFramePositionSafe = (
  position: Position,
  size: Size,
  viewPortSize: Size
): Position => {
  console.debug("makeFramePositionSafe", position, size)
  const halfWidth = size.width / 2
  const halfHeight = size.height / 2
  const leftDistance = position.left - halfWidth
  const rightDistance = viewPortSize.width - position.left - halfWidth
  const topDistance = position.top - halfHeight
  const bottomDistance = viewPortSize.height - position.top - halfHeight
  let newPosition = position
  if (leftDistance < 0) {
    newPosition.left = halfWidth
  }
  if (rightDistance < 0) {
    newPosition.left = viewPortSize.width - halfWidth
  }
  if (topDistance < 0) {
    newPosition.top = halfHeight
  }
  if (bottomDistance < 0) {
    newPosition.top = viewPortSize.height - halfHeight
  }
  return { ...newPosition }
}
