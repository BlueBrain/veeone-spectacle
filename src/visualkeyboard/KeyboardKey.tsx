import { Button, Grid } from "@mui/material"
import React, { useCallback, useMemo, useRef, useState } from "react"
import { OverridableStringUnion } from "@mui/types"
import { ButtonPropsColorOverrides } from "@mui/material/Button/Button"
import { useCurrentKeyboard } from "./CurrentKeyboardContext"
import KeyboardModeKey from "./keyboard-mode-key"
import useInteractable from "../interactable/useInteractable"
import { useConfig } from "../config/AppConfigContext"

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
  const config = useConfig()

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
    keyboard.onButtonPressed({
      buttonValue: value,
      mode,
    })
  }, [keyboard, mode, value])

  const optionalProps = {
    ...(color ? { color } : {}),
  }

  const [triggeringInterval, setTriggeringInterval] = useState(null)

  const startTriggering = useCallback(() => {
    const timeout = setInterval(
      triggerButton,
      config.VISUAL_KEYBOARD_REPEAT_INTERVAL_MS
    )
    setTriggeringInterval(timeout)
  }, [triggerButton])

  const stopTriggering = useCallback(() => {
    if (triggeringInterval !== null) {
      clearInterval(triggeringInterval)
      setTriggeringInterval(null)
    }
  }, [triggeringInterval])

  const onHoldHandler = useCallback(() => {
    startTriggering()
    if (typeof onHold === "function") {
      onHold()
    }
  }, [onHold, startTriggering])

  const onPointerUpHandler = useCallback(() => {
    stopTriggering()
  }, [stopTriggering])

  useInteractable(ref, {
    onHold: onHoldHandler,
    onPointerUp: onPointerUpHandler,
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
