import { generateRandomId } from "../common/random"
import { KeyboardId } from "./types"

interface VisualKeyboardInstanceConstructorArgs {
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
