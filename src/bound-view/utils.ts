import { Position } from "../common/types"
import { RefObject } from "react"

export function convertLocalPosition(
  pointerPosition: Position,
  viewZoomPercent: number,
  deskRef: RefObject<any>
): Position {
  const deskRect = (deskRef.current as HTMLDivElement).getBoundingClientRect()
  const relativeLeft =
    ((pointerPosition.left - deskRect.left) * 100) / viewZoomPercent
  const relativeTop =
    ((pointerPosition.top - deskRect.top) * 100) / viewZoomPercent
  const relativePosition = {
    left: relativeLeft,
    top: relativeTop,
  }
  return relativePosition
}
