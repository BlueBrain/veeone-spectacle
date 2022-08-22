import { KeyboardId } from "./components/VisualKeyboardContext"
import { generateRandomId } from "../common/random"

export interface VisualKeyboardInstanceConstructorArgs {
  target: HTMLElement
  onInputChange: (value: string) => void
  id?: KeyboardId
  initial?: string
}

class VisualKeyboardInstance {
  target: HTMLElement
  onInputChange: (value: string) => void
  id?: KeyboardId
  initial?: string

  constructor(args: VisualKeyboardInstanceConstructorArgs) {
    this.id = args.id ?? generateRandomId(8)
    this.initial = args.initial ?? ""
    this.target = args.target
    this.onInputChange = args.onInputChange
  }
}

export default VisualKeyboardInstance
