import { Button, Grid } from "@mui/material"
import React, { useCallback, useMemo, useRef } from "react"
import { OverridableStringUnion } from "@mui/types"
import { ButtonPropsColorOverrides } from "@mui/material/Button/Button"
import { useCurrentKeyboard } from "./CurrentKeyboardContext"
import KeyboardModeKey from "./keyboard-mode-key"
import useInteractable from "../interactable/useInteractable"

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
  onHold?: () => void
}

const KeyboardKey: React.FC<KeyboardKeyProps> = ({
  label,
  color = "neutral",
  grow = 1,
  customValue,
  onHold,
  mode = KeyboardModeKey.NORMAL,
}) => {
  const ref = useRef()
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
      buttonValue: value,
      mode,
    })
  }, [keyboard, mode, value])

  const optionalProps = {
    ...(color ? { color } : {}),
  }

  const onHoldHandler = useCallback(() => {
    console.debug("Holding button...")
    if (typeof onHold === "function") {
      onHold()
    }
  }, [onHold])

  useInteractable(ref, {
    onHold: onHoldHandler,
    onTap: triggerButton,
  })

  return (
    <Grid item sx={{ display: `flex`, flexGrow: grow, padding: `0 0.1rem` }}>
      {/* @ts-ignore */}
      <Button
        ref={ref}
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
