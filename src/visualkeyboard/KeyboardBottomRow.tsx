import KeyboardKey from "./KeyboardKey"
import KeyboardModeKey from "./keyboard-mode-key"
import KeyboardRow from "./KeyboardRow"
import React from "react"
import { useCurrentKeyboard } from "./CurrentKeyboardContext"

const KeyboardBottomRow: React.FC = () => {
  const { visualKeyboardInstance } = useCurrentKeyboard()
  return (
    <KeyboardRow>
      <KeyboardKey label={"Close"} mode={KeyboardModeKey.CANCEL} grow={1} />
      <KeyboardKey label={"@"} grow={1} />
      <KeyboardKey label={"Space"} customValue={" "} grow={8} />
      <KeyboardKey
        label={visualKeyboardInstance.doneButtonLabel}
        mode={KeyboardModeKey.DONE}
        color={"primary"}
        grow={2}
      />
    </KeyboardRow>
  )
}

export default KeyboardBottomRow
