import {
  ButtonPressedInfo,
  KeyboardContext,
  KeyboardContextProps,
} from "./KeyboardContext"
import React, { useCallback, useMemo } from "react"

interface KeyboardContextProviderProps {
  initialValue: string
  onValueChange(newValue: string): void
}

const KeyboardContextProvider: React.FC<KeyboardContextProviderProps> = ({
  initialValue,
  onValueChange,
  children,
}) => {
  const onButtonPressed = useCallback(
    (args: ButtonPressedInfo) => {
      // todo caret position
      onValueChange(initialValue + args.symbol)
    },
    [initialValue, onValueChange]
  )

  const providerValue: KeyboardContextProps = useMemo<KeyboardContextProps>(
    () => ({
      initialValue,
      onButtonPressed,
    }),
    [initialValue, onButtonPressed]
  )

  return (
    <KeyboardContext.Provider value={providerValue}>
      {children}
    </KeyboardContext.Provider>
  )
}

export default KeyboardContextProvider
