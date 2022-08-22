import React from "react"
import KeyboardRow from "../KeyboardRow"
import KeyboardKey from "../KeyboardKey"
import KeyboardModeKey from "../keyboard-mode-key"
import { Backspace } from "@mui/icons-material"
import ShiftKey from "./ShiftKey"

const KeyboardNormalLayout: React.FC = () => {
  return (
    <>
      <KeyboardRow>
        <KeyboardKey label={"1"} />
        <KeyboardKey label={"2"} />
        <KeyboardKey label={"3"} />
        <KeyboardKey label={"4"} />
        <KeyboardKey label={"5"} />
        <KeyboardKey label={"6"} />
        <KeyboardKey label={"7"} />
        <KeyboardKey label={"8"} />
        <KeyboardKey label={"9"} />
        <KeyboardKey label={"0"} />
        <KeyboardKey label={"-"} />
        <KeyboardKey label={"="} />
        <KeyboardKey
          label={<Backspace />}
          mode={KeyboardModeKey.BACKSPACE}
          grow={4}
        />
      </KeyboardRow>
      <KeyboardRow>
        <KeyboardKey label={"q"} />
        <KeyboardKey label={"w"} />
        <KeyboardKey label={"e"} />
        <KeyboardKey label={"r"} />
        <KeyboardKey label={"t"} />
        <KeyboardKey label={"y"} />
        <KeyboardKey label={"u"} />
        <KeyboardKey label={"i"} />
        <KeyboardKey label={"o"} />
        <KeyboardKey label={"p"} />
        <KeyboardKey label={"["} />
        <KeyboardKey label={"]"} />
      </KeyboardRow>
      <KeyboardRow>
        <KeyboardKey label={"a"} />
        <KeyboardKey label={"s"} />
        <KeyboardKey label={"d"} />
        <KeyboardKey label={"f"} />
        <KeyboardKey label={"g"} />
        <KeyboardKey label={"h"} />
        <KeyboardKey label={"j"} />
        <KeyboardKey label={"k"} />
        <KeyboardKey label={"l"} />
        <KeyboardKey label={";"} />
        <KeyboardKey label={"'"} />
        <KeyboardKey label={"\\"} />
      </KeyboardRow>
      <KeyboardRow>
        <ShiftKey />
        <KeyboardKey label={"z"} />
        <KeyboardKey label={"x"} />
        <KeyboardKey label={"c"} />
        <KeyboardKey label={"v"} />
        <KeyboardKey label={"b"} />
        <KeyboardKey label={"n"} />
        <KeyboardKey label={"m"} />
        <KeyboardKey label={","} />
        <KeyboardKey label={"."} />
        <KeyboardKey label={"/"} />
        <ShiftKey />
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

export default KeyboardNormalLayout
