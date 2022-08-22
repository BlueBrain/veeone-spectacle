import { createContext, useContext } from "react"
import KeyboardModeKey from "./keyboard-mode-key"
import KeyboardLayoutMode from "./keyboard-layout-mode"

export interface ButtonPressedInfo {
  value: string
  mode: KeyboardModeKey
}

export interface KeyboardContextProps {
  initialValue: string
  onButtonPressed(args: ButtonPressedInfo): void
  keyboardLayoutMode: KeyboardLayoutMode
  uppercaseModeLocked: boolean
}

export const KeyboardContext = createContext<KeyboardContextProps>(null)

export const useCurrentKeyboard = () => useContext(KeyboardContext)
