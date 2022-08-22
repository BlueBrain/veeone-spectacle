import "react-simple-keyboard/build/css/index.css"
import React, { useEffect, useMemo, useState } from "react"
import { Box } from "@mui/material"
import Keyboard from "./Keyboard"
import KeyboardContextProvider from "./KeyboardContextProvider"
import { getBlueBrainTheme } from "../../branding/bbp-theme"
import { useConfig } from "../../config/AppConfigContext"
import { ThemeProvider } from "@mui/styles"
import VisualKeyboardInstance from "../visual-keyboard-instance"

interface VisualKeyboardProps {
  instance: VisualKeyboardInstance
  onDone: (result: string) => void
}

export const VisualKeyboard: React.FC<VisualKeyboardProps> = ({
  instance,
  onDone,
}) => {
  const [value, setValue] = useState<string>(instance.initial)
  const config = useConfig()
  const blueBrainTheme = useMemo(() => getBlueBrainTheme(config), [config])

  useEffect(() => {
    instance.onInputChange(value)
  }, [value, instance])

  const handleInputChange = input => {
    console.log("Input changed (VisualKeyboard level)", input)
    setValue(input)
  }

  const handleOnDone = result => {
    onDone(result)
  }

  const targetRect = useMemo(() => instance.target.getBoundingClientRect(), [
    instance.target,
  ])

  return (
    <Box
      sx={{
        boxShadow: `4px 4px 15px rgba(0, 0, 0, 0.25)`,
        position: `absolute`,
        left: `${targetRect.left}px`,
        top: `${targetRect.bottom}px`,
        marginTop: `0.1rem`,
        zIndex: 2000,
      }}
    >
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
