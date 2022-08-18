import { createContext, useContext } from "react"

export interface ButtonPressedInfo {
  symbol: string
}

export interface KeyboardContextProps {
  initialValue: string
  onButtonPressed(args: ButtonPressedInfo): void
}

export const KeyboardContext = createContext<KeyboardContextProps>(null)

export const useKeyboard = () => useContext(KeyboardContext)
