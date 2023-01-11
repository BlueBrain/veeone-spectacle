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

interface KeyboardState {
  text: string
  caret: number
}

const CurrentKeyboardContextProvider: React.FC<CurrentKeyboardContextProviderProps> = ({
  children,
  visualKeyboardInstance,
  onDone,
}) => {
  const { closeKeyboardById } = useVisualKeyboard()
  const [keyboardState, setKeyboardState] = useState<KeyboardState>({
    text: visualKeyboardInstance.initial,
    caret: visualKeyboardInstance.initial.length,
  })
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

      switch (mode) {
        case KeyboardModeKey.NORMAL: {
          setKeyboardState((prevState: KeyboardState) => {
            const textBefore = prevState.text.substring(0, prevState.caret)
            const textAfter = prevState.text.substring(prevState.caret)
            const newText = textBefore + buttonValue + textAfter
            if (
              !uppercaseModeLocked &&
              keyboardLayoutMode === KeyboardLayoutMode.UPPERCASE
            ) {
              setKeyboardLayoutMode(KeyboardLayoutMode.NORMAL)
            }
            return {
              text: newText,
              caret: prevState.caret + buttonValue.length,
            }
          })
          break
        }
        case KeyboardModeKey.BACKSPACE: {
          setKeyboardState((prevState: KeyboardState) => {
            const newText =
              prevState.text.substring(0, prevState.caret - 1) +
              prevState.text.substring(prevState.caret)
            return {
              text: newText,
              caret: prevState.caret > 1 ? prevState.caret - 1 : 0,
            }
          })

          break
        }
        case KeyboardModeKey.CLEAR_ALL: {
          setKeyboardState({ text: "", caret: 0 })
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
          onDone({ visualKeyboardInstance, value: keyboardState.text })
          break
        }
        case KeyboardModeKey.CANCEL: {
          closeKeyboard()
        }
      }
    },
    [
      keyboardState,
      closeKeyboard,
      keyboardLayoutMode,
      onDone,
      uppercaseModeLocked,
      visualKeyboardInstance,
    ]
  )

  useEffect(() => {
    const boundEvents = ["click", "focus", "keydown", "keyup"]
    const updateCaretPosition = () => {
      setKeyboardState((prevState: KeyboardState) => ({
        text: prevState.text,
        caret: target.selectionStart,
      }))
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
    if (target.value !== keyboardState.text) {
      setKeyboardState((prevState: KeyboardState) => ({
        text: target.value,
        caret: prevState.caret,
      }))
    }
  }, [target.value, keyboardState.text])

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
    visualKeyboardInstance.onInputChange(keyboardState.text)
  }, [keyboardState.text, visualKeyboardInstance])

  const providerValue: CurrentKeyboardContextProps = useMemo<CurrentKeyboardContextProps>(
    () => ({
      value: keyboardState.text,
      onButtonPressed,
      keyboardLayoutMode,
      uppercaseModeLocked,
      visualKeyboardInstance,
    }),
    [
      keyboardState.text,
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
