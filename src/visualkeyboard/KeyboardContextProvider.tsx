import {
  ButtonPressedInfo,
  KeyboardContext,
  KeyboardContextProps,
} from "./KeyboardContext"
import React, { useCallback, useEffect, useMemo, useState } from "react"
import KeyboardModeKey from "./keyboard-mode-key"
import KeyboardLayoutMode from "./keyboard-layout-mode"
import VisualKeyboardInstance from "./visual-keyboard-instance"
import { debounce } from "lodash"
import { VisualKeyboardOnDoneArgs } from "./types"

interface KeyboardContextProviderProps {
  visualKeyboardInstance: VisualKeyboardInstance
  onDone(result: VisualKeyboardOnDoneArgs): void
}

const KeyboardContextProvider: React.FC<KeyboardContextProviderProps> = ({
  children,
  visualKeyboardInstance,
  onDone,
}) => {
  const [value, setValue] = useState<string>(visualKeyboardInstance.initial)
  const [caretPosition, setCaretPosition] = useState(0)
  const [uppercaseModeLocked, setUppercaseModeLocked] = useState(false)
  const [keyboardLayoutMode, setKeyboardLayoutMode] = useState(
    KeyboardLayoutMode.NORMAL
  )
  const target = visualKeyboardInstance.target as HTMLInputElement

  const onButtonPressed = useCallback(
    (args: ButtonPressedInfo) => {
      const { buttonValue, mode } = args

      switch (mode) {
        case KeyboardModeKey.NORMAL: {
          const resultText =
            value.substring(0, caretPosition) +
            buttonValue +
            value.substring(caretPosition)
          setCaretPosition(caretPosition + buttonValue.length)
          setValue(resultText)

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
            value.substring(0, caretPosition - 1) +
            value.substring(caretPosition)
          setCaretPosition(caretPosition > 1 ? caretPosition - 1 : 0)
          setValue(resultText)
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
          onDone({ visualKeyboardInstance, value })
          break
        }
      }
    },
    [
      caretPosition,
      keyboardLayoutMode,
      onDone,
      uppercaseModeLocked,
      value,
      visualKeyboardInstance,
    ]
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

  const triggerInputValueChange = useCallback(() => {
    if (target.value !== value) {
      setValue(target.value)
    }
  }, [target.value, value])

  const limitedInputValueChanger = useMemo(
    () => debounce(triggerInputValueChange, 500),
    [triggerInputValueChange]
  )

  useEffect(() => {
    const eventName = "keydown"
    target.addEventListener(eventName, limitedInputValueChanger)
    return () => {
      target.removeEventListener(eventName, limitedInputValueChanger)
    }
  }, [limitedInputValueChanger, target])

  useEffect(() => {
    visualKeyboardInstance.onInputChange(value)
  }, [value, visualKeyboardInstance])

  const providerValue: KeyboardContextProps = useMemo<KeyboardContextProps>(
    () => ({
      value,
      onButtonPressed,
      keyboardLayoutMode,
      uppercaseModeLocked,
    }),
    [value, keyboardLayoutMode, onButtonPressed, uppercaseModeLocked]
  )

  return (
    <KeyboardContext.Provider value={providerValue}>
      {children}
    </KeyboardContext.Provider>
  )
}

export default KeyboardContextProvider
