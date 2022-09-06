import { RefObject, useEffect } from "react"
import interact from "interactjs"

interface UseInteracatableArgs {
  onTap?(event): void
  onHold?(event): void
}

const useInteractable = (
  ref: RefObject<any>,
  { onTap, onHold }: UseInteracatableArgs
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
    }
    return () => {
      interact(target).unset()
    }
  }, [onHold, onTap, ref])
}

export default useInteractable