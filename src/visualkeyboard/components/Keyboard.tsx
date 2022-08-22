import { Box, Grid } from "@mui/material"
import React, { useMemo } from "react"
import { useCurrentKeyboard } from "./KeyboardContext"
import KeyboardNormalLayout from "./layouts/KeyboardNormalLayout"
import KeyboardLayoutMode from "./keyboard-layout-mode"
import KeyboardUppercaseLayout from "./layouts/KeyboardUppercaseLayout"

const KEYBOARD_LAYOUTS = {
  [KeyboardLayoutMode.NORMAL]: KeyboardNormalLayout,
  [KeyboardLayoutMode.UPPERCASE]: KeyboardUppercaseLayout,
  [KeyboardLayoutMode.SPECIAL_CHARS]: KeyboardNormalLayout,
}

const Keyboard: React.FC = () => {
  const { keyboardLayoutMode } = useCurrentKeyboard()

  const KeyboardLayoutComponent = useMemo(
    () => KEYBOARD_LAYOUTS[keyboardLayoutMode],
    [keyboardLayoutMode]
  )

  return (
    <Box
      sx={{
        flexGrow: 1,
        width: `28rem`,
        // @ts-ignore
        background: theme => theme.palette.neutral.dark,
        padding: `0.2rem`,
      }}
    >
      <Grid container>
        <KeyboardLayoutComponent />
      </Grid>
    </Box>
  )
}

export default Keyboard
