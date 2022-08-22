import {
  ButtonPressedInfo,
  KeyboardContext,
  KeyboardContextProps,
} from "./KeyboardContext"
import React, { useCallback, useEffect, useMemo, useState } from "react"
import KeyboardModeKey from "./keyboard-mode-key"
import KeyboardLayoutMode from "./keyboard-layout-mode"
import VisualKeyboardInstance from "./visual-keyboard-instance"

interface KeyboardContextProviderProps {
  initialValue: string
  visualKeyboardInstance: VisualKeyboardInstance
  onValueChange(newValue: string): void
  onDone(result: string): void
}

const KeyboardContextProvider: React.FC<KeyboardContextProviderProps> = ({
  initialValue,
  onValueChange,
  children,
  visualKeyboardInstance,
  onDone,
}) => {
  const [caretPosition, setCaretPosition] = useState(0)
  const [uppercaseModeLocked, setUppercaseModeLocked] = useState(false)
  const [keyboardLayoutMode, setKeyboardLayoutMode] = useState(
    KeyboardLayoutMode.NORMAL
  )
  const target = visualKeyboardInstance.target as HTMLInputElement

  const onButtonPressed = useCallback(
    (args: ButtonPressedInfo) => {
      const { value, mode } = args

      switch (mode) {
        case KeyboardModeKey.NORMAL: {
          const resultText =
            initialValue.substring(0, caretPosition) +
            value +
            initialValue.substring(caretPosition)
          setCaretPosition(caretPosition + value.length)
          onValueChange(resultText)

          if (
            !uppercaseModeLocked &&
            keyboardLayoutMode === KeyboardLayoutMode.UPPERCASE
          ) {
            setKeyboardLayoutMode(KeyboardLayoutMode.NORMAL)
          }

          break
        }
        case KeyboardModeKey.BACKSPACE: {
          const resultText =
            initialValue.substring(0, caretPosition - 1) +
            initialValue.substring(caretPosition)
          setCaretPosition(caretPosition > 1 ? caretPosition - 1 : 0)
          onValueChange(resultText)
          break
        }
        case KeyboardModeKey.SHIFT: {
          if (keyboardLayoutMode === KeyboardLayoutMode.NORMAL) {
            setKeyboardLayoutMode(KeyboardLayoutMode.UPPERCASE)
          } else {
            if (!uppercaseModeLocked) {
              setUppercaseModeLocked(true)
            } else {
              setUppercaseModeLocked(false)
              setKeyboardLayoutMode(KeyboardLayoutMode.NORMAL)
            }
          }
          break
        }
        case KeyboardModeKey.SPECIAL_CHARS: {
          break
        }
        case KeyboardModeKey.DONE: {
          onDone(value)
          break
        }
      }
    },
    [
      caretPosition,
      initialValue,
      keyboardLayoutMode,
      onDone,
      onValueChange,
      uppercaseModeLocked,
    ]
  )

  const providerValue: KeyboardContextProps = useMemo<KeyboardContextProps>(
    () => ({
      initialValue,
      onButtonPressed,
      keyboardLayoutMode,
      uppercaseModeLocked,
    }),
    [initialValue, keyboardLayoutMode, onButtonPressed, uppercaseModeLocked]
  )

  useEffect(() => {
    const boundEvents = ["click", "focus", "keydown", "keyup"]
    const updateCaretPosition = () => {
      setCaretPosition(target.selectionStart)
    }
    boundEvents.forEach(eventName =>
      target.addEventListener(eventName, updateCaretPosition)
    )
    return () => {
      boundEvents.forEach(eventName =>
        target.removeEventListener(eventName, updateCaretPosition)
      )
    }
  }, [target])

  return (
    <KeyboardContext.Provider value={providerValue}>
      {children}
    </KeyboardContext.Provider>
  )
}

export default KeyboardContextProvider
