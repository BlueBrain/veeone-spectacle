import { createContext, useContext } from "react"
import VisualKeyboardInstance from "../visual-keyboard-instance"

export type KeyboardId = string
export interface OpenKeyboardOptions {
  target: HTMLElement
  onInputChange: (value: string) => void
  initial?: string
  customKeyboardId?: KeyboardId
}

export interface VisualKeyboardContextProps {
  keyboards: VisualKeyboardInstance[]
  openKeyboard: (args: OpenKeyboardOptions) => VisualKeyboardInstance
  closeKeyboard: (keyboardId: KeyboardId) => void
  closeKeyboardByTarget: (target: HTMLElement) => void
  updateKeyboardState: (keyboardId: KeyboardId, value: string) => void
}

const VisualKeyboardContext = createContext<VisualKeyboardContextProps>(null)

export const useVisualKeyboard = () => useContext(VisualKeyboardContext)

export default VisualKeyboardContext
