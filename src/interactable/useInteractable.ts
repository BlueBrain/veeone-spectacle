import { RefObject, useEffect } from "react"
import interact from "interactjs"

interface UseInteracatableArgs {
  onTap?(event): void
  onHold?(event): void
  onPointerUp?(event): void
  onPointerDown?(event): void
}

const useInteractable = (
  ref: RefObject<any>,
  { onTap, onHold, onPointerUp, onPointerDown }: UseInteracatableArgs
) => {
  useEffect(() => {
    const target = ref.current
    if (target) {
      if (onTap) {
        interact(target).on("tap", onTap)
      }
      if (onHold) {
        interact(target).on("hold", onHold)
      }
      if (onPointerUp) {
        interact(target).on("up", onPointerUp)
      }
      if (onPointerDown) {
        interact(target).on("down", onPointerDown)
      }
    }
    return () => {
      interact(target).unset()
    }
  }, [onHold, onPointerUp, onTap, ref])
}

export default useInteractable
