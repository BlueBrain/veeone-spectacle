import { createContext, useContext } from "react"
import KeyboardModeKey from "./keyboard-mode-key"
import KeyboardLayoutMode from "./keyboard-layout-mode"
import VisualKeyboardInstance from "./visual-keyboard-instance"

export interface ButtonPressedInfo {
  buttonValue: string
  mode: KeyboardModeKey
}

export interface CurrentKeyboardContextProps {
  value: string
  onButtonPressed(args: ButtonPressedInfo): void
  keyboardLayoutMode: KeyboardLayoutMode
  uppercaseModeLocked: boolean
  visualKeyboardInstance: VisualKeyboardInstance
}

export const CurrentKeyboardContext = createContext<CurrentKeyboardContextProps>(
  null
)

export const useCurrentKeyboard = () => useContext(CurrentKeyboardContext)
