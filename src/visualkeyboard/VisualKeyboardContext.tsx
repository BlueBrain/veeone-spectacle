import { createContext, useContext } from "react"
import VisualKeyboardInstance from "./visual-keyboard-instance"
import { KeyboardId } from "./types"

export interface OpenKeyboardOptions {
  target: HTMLElement
  onInputChange: (value: string) => void
  initial?: string
  customKeyboardId?: KeyboardId
  onDone?: (value: string) => void
  doneButtonLabel?: string
}

export interface VisualKeyboardContextProps {
  keyboards: VisualKeyboardInstance[]
  openKeyboard: (args: OpenKeyboardOptions) => VisualKeyboardInstance
  closeKeyboardById: (keyboardId: KeyboardId) => void
  closeKeyboardByTarget: (target: HTMLElement) => void
}

const VisualKeyboardContext = createContext<VisualKeyboardContextProps>(null)

export const useVisualKeyboard = () => useContext(VisualKeyboardContext)

export default VisualKeyboardContext
