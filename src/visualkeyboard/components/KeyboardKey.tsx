import { Button, Grid } from "@mui/material"
import React, { useCallback, useMemo } from "react"
import { OverridableStringUnion } from "@mui/types"
import { ButtonPropsColorOverrides } from "@mui/material/Button/Button"
import { useCurrentKeyboard } from "./KeyboardContext"
import KeyboardModeKey from "./keyboard-mode-key"

interface KeyboardKeyProps {
  label: string | React.ComponentElement<any, any>
  customValue?: string
  grow?: number
  color?: OverridableStringUnion<
    | "inherit"
    | "primary"
    | "secondary"
    | "neutral"
    | "success"
    | "error"
    | "info"
    | "warning",
    ButtonPropsColorOverrides
  >
  mode?: KeyboardModeKey
}

const KeyboardKey: React.FC<KeyboardKeyProps> = ({
  label,
  color = "neutral",
  grow = 1,
  customValue,
  mode = KeyboardModeKey.NORMAL,
}) => {
  const keyboard = useCurrentKeyboard()

  const value: string = useMemo(
    () =>
      typeof customValue !== "undefined"
        ? customValue
        : typeof label === "string"
        ? (label as string)
        : "",
    [customValue, label]
  )

  const triggerButton = useCallback(() => {
    console.debug("key pressed")
    keyboard.onButtonPressed({
      value,
      mode,
    })
  }, [keyboard, mode, value])

  const optionalProps = {
    ...(color ? { color } : {}),
  }

  return (
    <Grid item sx={{ display: `flex`, flexGrow: grow, padding: `0 0.1rem` }}>
      {/* @ts-ignore */}
      <Button
        onClick={triggerButton}
        variant={"contained"}
        {...optionalProps}
        sx={{
          minWidth: `1.5rem`,
          minHeight: `2.5rem`,
          display: `flex`,
          flexGrow: 1,
          padding: `0.1rem`,
          textTransform: `none`,
          boxShadow: 1,
          fontWeight: `600`,
          fontSize: `0.9rem`,
        }}
      >
        {label}
      </Button>
    </Grid>
  )
}

export default KeyboardKey
