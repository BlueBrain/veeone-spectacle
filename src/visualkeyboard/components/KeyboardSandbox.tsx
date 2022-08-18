import { Box, TextField } from "@mui/material"
import React, { useCallback, useRef, useState } from "react"
import { visualKeyboardService } from "../services/visualKeyboardService"

const KeyboardSandbox: React.FC = () => {
  const keyboardId = "test"
  const ref = useRef()
  const [value, setValue] = useState("")

  const handleTextInputChange = event => {
    const value = event.target.value
    setValue(value)
    visualKeyboardService.updateKeyboardState(keyboardId, value)
  }

  const showVisualKeyboard = useCallback((target, initialValue: string) => {
    visualKeyboardService.newKeyboard(target, newValue => setValue(newValue), {
      initialValue,
      keyboardId,
    })
  }, [])

  return (
    <Box sx={{ position: "absolute", left: `20rem`, top: `20rem` }}>
      keyboard sandbox
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
