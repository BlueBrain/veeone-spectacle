import "react-simple-keyboard/build/css/index.css"
import React, { useEffect, useState } from "react"
import { Box } from "@mui/material"
import Keyboard from "./Keyboard"
import KeyboardContextProvider from "./KeyboardContextProvider"
import { VisualKeyboardInstance } from "../services/visualKeyboardService"

interface VisualKeyboardProps {
  instance: VisualKeyboardInstance
  initialValue?: string
  onInputChange: (button) => void
  onDone: (result: string) => void
}

export const VisualKeyboard: React.FC<VisualKeyboardProps> = ({
  initialValue = "",
  onInputChange,
  instance,
  onDone,
}) => {
  const [value, setValue] = useState<string>(initialValue)

  useEffect(() => {
    onInputChange(value)
  }, [value, onInputChange])

  const handleInputChange = input => {
    console.log("Input changed (VisualKeyboard level)", input)
    setValue(input)
  }

  const handleOnDone = result => {
    onDone(result)
  }

  return (
    <Box sx={{ boxShadow: `4px 4px 15px rgba(0, 0, 0, 0.25)` }}>
      <KeyboardContextProvider
        visualKeyboardInstance={instance}
        initialValue={value}
        onValueChange={handleInputChange}
        onDone={handleOnDone}
      >
        <Keyboard />
      </KeyboardContextProvider>
    </Box>
  )
}
