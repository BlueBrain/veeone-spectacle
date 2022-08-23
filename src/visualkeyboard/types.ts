import VisualKeyboardInstance from "./visual-keyboard-instance"

export type KeyboardId = string

export interface VisualKeyboardOnDoneArgs {
  visualKeyboardInstance: VisualKeyboardInstance
  value: string
}
