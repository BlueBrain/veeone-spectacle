import {
  ButtonPressedInfo,
  CurrentKeyboardContext,
  CurrentKeyboardContextProps,
} from "./CurrentKeyboardContext"
import React, { useCallback, useEffect, useMemo, useState } from "react"
import KeyboardModeKey from "./keyboard-mode-key"
import KeyboardLayoutMode from "./keyboard-layout-mode"
import VisualKeyboardInstance from "./visual-keyboard-instance"
import { debounce } from "lodash"
import { VisualKeyboardOnDoneArgs } from "./types"
import { useVisualKeyboard } from "./VisualKeyboardContext"

interface CurrentKeyboardContextProviderProps {
  visualKeyboardInstance: VisualKeyboardInstance
  onDone(result: VisualKeyboardOnDoneArgs): void
}

const CurrentKeyboardContextProvider: React.FC<CurrentKeyboardContextProviderProps> = ({
  children,
  visualKeyboardInstance,
  onDone,
}) => {
  const { closeKeyboardById } = useVisualKeyboard()
  const [value, setValue] = useState<string>(visualKeyboardInstance.initial)
  const [caretPosition, setCaretPosition] = useState(0)
  const [uppercaseModeLocked, setUppercaseModeLocked] = useState(false)
  const [keyboardLayoutMode, setKeyboardLayoutMode] = useState(
    KeyboardLayoutMode.NORMAL
  )
  const target = visualKeyboardInstance.target as HTMLInputElement

  const closeKeyboard = useCallback(
    () => closeKeyboardById(visualKeyboardInstance.id),
    [closeKeyboardById, visualKeyboardInstance.id]
  )

  const onButtonPressed = useCallback(
    (args: ButtonPressedInfo) => {
      const { buttonValue, mode } = args
      console.debug("onButtonPressed", buttonValue, mode, "value=", value)
      // todo fix - initial value is always the same (with the interval; it doesn't work)

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
        case KeyboardModeKey.CLEAR_ALL: {
          setCaretPosition(0)
          setValue("")
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
        case KeyboardModeKey.CANCEL: {
          closeKeyboard()
        }
      }
    },
    [
      caretPosition,
      closeKeyboard,
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

  const providerValue: CurrentKeyboardContextProps = useMemo<CurrentKeyboardContextProps>(
    () => ({
      value,
      onButtonPressed,
      keyboardLayoutMode,
      uppercaseModeLocked,
      visualKeyboardInstance,
    }),
    [
      value,
      keyboardLayoutMode,
      onButtonPressed,
      uppercaseModeLocked,
      visualKeyboardInstance,
    ]
  )

  return (
    <CurrentKeyboardContext.Provider value={providerValue}>
      {children}
    </CurrentKeyboardContext.Provider>
  )
}

export default CurrentKeyboardContextProvider
