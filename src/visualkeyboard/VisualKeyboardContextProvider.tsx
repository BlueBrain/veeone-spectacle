import React, { useCallback, useMemo, useState } from "react"
import VisualKeyboardContext, {
  OpenKeyboardOptions,
  VisualKeyboardContextProps,
} from "./VisualKeyboardContext"
import { VisualKeyboard } from "./VisualKeyboard"
import VisualKeyboardInstance from "./visual-keyboard-instance"
import { KeyboardId } from "./types"

const VisualKeyboardContextProvider: React.FC = ({ children }) => {
  const [keyboards, setKeyboards] = useState<VisualKeyboardInstance[]>([])

  const keyboardExistsOnTarget = useCallback(
    (target: HTMLElement) => {
      return keyboards.find(k => k.target === target)
    },
    [keyboards]
  )

  const openKeyboard = useCallback(
    ({
      onInputChange,
      target,
      initial,
      customKeyboardId,
    }: OpenKeyboardOptions) => {
      const existingKeyboard = keyboardExistsOnTarget(target)
      if (existingKeyboard) {
        return existingKeyboard
      }
      const newKeyboard = new VisualKeyboardInstance({
        id: customKeyboardId,
        target,
        onInputChange,
        initial,
      })
      setKeyboards(currentKeyboards => [...currentKeyboards, newKeyboard])
      return newKeyboard
    },
    [keyboardExistsOnTarget]
  )

  const closeKeyboardByTarget = useCallback((target: HTMLElement) => {
    console.debug("closeKeyboardByTarget")
    setKeyboards(currentKeyboards =>
      currentKeyboards.filter(k => k.target !== target)
    )
  }, [])

  const closeKeyboard = useCallback((keyboardId: KeyboardId) => {
    setKeyboards(currentKeyboards =>
      currentKeyboards.filter(k => k.id !== keyboardId)
    )
  }, [])

  const providerValue = useMemo<VisualKeyboardContextProps>(
    () => ({
      keyboards,
      openKeyboard,
      closeKeyboard,
      closeKeyboardByTarget,
    }),
    [closeKeyboard, closeKeyboardByTarget, keyboards, openKeyboard]
  )

  const keyboardComponents = useMemo(
    () =>
      keyboards.map((keyboard, i) => (
        <VisualKeyboard
          key={i}
          instance={keyboard}
          onDone={() => closeKeyboard(keyboard.id)}
        />
      )),
    [closeKeyboard, keyboards]
  )

  return (
    <VisualKeyboardContext.Provider value={providerValue}>
      {children}
      <>{keyboardComponents}</>
    </VisualKeyboardContext.Provider>
  )
}

export default VisualKeyboardContextProvider
