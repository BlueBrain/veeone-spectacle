import "react-simple-keyboard/build/css/index.css"
import React, { useMemo } from "react"
import { Box } from "@mui/material"
import Keyboard from "./Keyboard"
import CurrentKeyboardContextProvider from "./CurrentKeyboardContextProvider"
import VisualKeyboardInstance from "./visual-keyboard-instance"
import { VisualKeyboardOnDoneArgs } from "./types"

interface VisualKeyboardProps {
  instance: VisualKeyboardInstance
  onDone: (args: VisualKeyboardOnDoneArgs) => void
}

export const VisualKeyboard: React.FC<VisualKeyboardProps> = ({
  instance,
  onDone,
}) => {
  const handleOnDone = args => {
    // Just pass on the result
    onDone(args)
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
        maxWidth: `28rem`,
      }}
    >
      <CurrentKeyboardContextProvider
        visualKeyboardInstance={instance}
        onDone={handleOnDone}
      >
        <Keyboard />
      </CurrentKeyboardContextProvider>
    </Box>
  )
}
