import { ReactElement, RefObject, useEffect } from "react"
import interact from "interactjs"

const useInteractable = (ref: RefObject<any>, { onTap }) => {
  useEffect(() => {
    const target = ref.current
    interact(target).on("tap", onTap)
    return () => {
      interact(target).unset()
    }
  }, [onTap, ref])
}

export default useInteractable
