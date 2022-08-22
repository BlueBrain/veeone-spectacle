import { Box, TextField } from "@mui/material"
import React, { useCallback, useRef, useState } from "react"
import { useVisualKeyboard } from "./VisualKeyboardContext"
import { KeyboardId } from "./types"

const KeyboardSandbox: React.FC = () => {
  const { openKeyboard, updateKeyboardState } = useVisualKeyboard()
  const keyboardId: KeyboardId = "test"
  const ref = useRef()
  const [value, setValue] = useState("")

  const handleTextInputChange = event => {
    const value = event.target.value
    setValue(value)
    updateKeyboardState(keyboardId, value)
  }

  const showVisualKeyboard = useCallback(
    (target, initialValue: string) => {
      openKeyboard({
        target,
        initial: initialValue,
        onInputChange: newValue => setValue(newValue),
      })
    },
    [openKeyboard]
  )

  return (
    <Box
      sx={{
        position: "absolute",
        left: `10rem`,
        top: `10rem`,
        width: `30rem`,
        height: `5rem`,
        background: `white`,
      }}
    >
      <TextField
        inputRef={ref}
        type={"text"}
        variant={"outlined"}
        label={"Name of your presentation"}
        autoFocus={true}
        fullWidth={true}
        value={value}
        onChange={handleTextInputChange}
        onFocus={event => showVisualKeyboard(event.target, value)}
      />
    </Box>
  )
}

export default KeyboardSandbox
