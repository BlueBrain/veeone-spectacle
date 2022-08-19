import React from "react"
import KeyboardRow from "../KeyboardRow"
import KeyboardKey from "../KeyboardKey"
import KeyboardModeKey from "../keyboard-mode-key"
import Shift from "./Shift"
import { Backspace } from "@mui/icons-material"

const KeyboardUppercaseLayout: React.FC = () => {
  return (
    <>
      <KeyboardRow>
        <KeyboardKey label={"!"} />
        <KeyboardKey label={"@"} />
        <KeyboardKey label={"#"} />
        <KeyboardKey label={"$"} />
        <KeyboardKey label={"%"} />
        <KeyboardKey label={"^"} />
        <KeyboardKey label={"&"} />
        <KeyboardKey label={"*"} />
        <KeyboardKey label={"("} />
        <KeyboardKey label={")"} />
        <KeyboardKey label={"_"} />
        <KeyboardKey label={"+"} />
        <KeyboardKey
          label={<Backspace />}
          mode={KeyboardModeKey.BACKSPACE}
          grow={4}
        />
      </KeyboardRow>
      <KeyboardRow>
        <KeyboardKey label={"Q"} />
        <KeyboardKey label={"W"} />
        <KeyboardKey label={"E"} />
        <KeyboardKey label={"R"} />
        <KeyboardKey label={"T"} />
        <KeyboardKey label={"Y"} />
        <KeyboardKey label={"U"} />
        <KeyboardKey label={"I"} />
        <KeyboardKey label={"O"} />
        <KeyboardKey label={"P"} />
        <KeyboardKey label={"{"} />
        <KeyboardKey label={"}"} />
      </KeyboardRow>
      <KeyboardRow>
        <KeyboardKey label={"A"} />
        <KeyboardKey label={"S"} />
        <KeyboardKey label={"D"} />
        <KeyboardKey label={"F"} />
        <KeyboardKey label={"G"} />
        <KeyboardKey label={"H"} />
        <KeyboardKey label={"J"} />
        <KeyboardKey label={"K"} />
        <KeyboardKey label={"L"} />
        <KeyboardKey label={":"} />
        <KeyboardKey label={'"'} />
        <KeyboardKey label={"|"} />
      </KeyboardRow>
      <KeyboardRow>
        <KeyboardKey label={<Shift />} mode={KeyboardModeKey.SHIFT} grow={4} />
        <KeyboardKey label={"Z"} />
        <KeyboardKey label={"X"} />
        <KeyboardKey label={"C"} />
        <KeyboardKey label={"V"} />
        <KeyboardKey label={"B"} />
        <KeyboardKey label={"N"} />
        <KeyboardKey label={"M"} />
        <KeyboardKey label={"<"} />
        <KeyboardKey label={">"} />
        <KeyboardKey label={"?"} />
        <KeyboardKey label={<Shift />} mode={KeyboardModeKey.SHIFT} grow={4} />
      </KeyboardRow>
      <KeyboardRow>
        <KeyboardKey label={"@"} />
        <KeyboardKey label={"Space"} customValue={" "} grow={4} />
        <KeyboardKey
          label={"Done"}
          mode={KeyboardModeKey.DONE}
          color={"primary"}
        />
      </KeyboardRow>
    </>
  )
}

export default KeyboardUppercaseLayout
