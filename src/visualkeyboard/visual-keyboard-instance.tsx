import { generateRandomId } from "../common/random"
import { KeyboardId } from "./types"

interface VisualKeyboardInstanceConstructorArgs {
  target: HTMLElement
  onInputChange: (value: string) => void
  id?: KeyboardId
  initial?: string
  onDone?: (value: string) => void
  doneButtonLabel: string
}

class VisualKeyboardInstance {
  target: HTMLElement
  onInputChange: (value: string) => void
  id?: KeyboardId
  initial?: string
  doneButtonLabel?: string
  onDone?: (value: string) => void

  constructor(args: VisualKeyboardInstanceConstructorArgs) {
    this.id = args.id ?? generateRandomId(8)
    this.initial = args.initial ?? ""
    this.target = args.target
    this.onInputChange = args.onInputChange
    this.onDone = args.onDone
    this.doneButtonLabel = args.doneButtonLabel ?? "Done"
  }
}

export default VisualKeyboardInstance
