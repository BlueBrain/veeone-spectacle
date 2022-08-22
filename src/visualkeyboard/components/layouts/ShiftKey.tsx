import { Forward, Upload } from "@mui/icons-material"
import React, { useMemo } from "react"
import { useCurrentKeyboard } from "../KeyboardContext"
import KeyboardModeKey from "../keyboard-mode-key"
import KeyboardKey from "../KeyboardKey"

const ShiftKey: React.FC = () => {
  const { uppercaseModeLocked } = useCurrentKeyboard()
  const icon = useMemo(
    () =>
      uppercaseModeLocked ? (
        <Upload />
      ) : (
        <Forward sx={{ transform: `rotate(-90deg)` }} />
      ),
    [uppercaseModeLocked]
  )

  const color = useMemo(() => (uppercaseModeLocked ? "primary" : "neutral"), [
    uppercaseModeLocked,
  ])

  return (
    <KeyboardKey
      label={icon}
      color={color}
      mode={KeyboardModeKey.SHIFT}
      grow={4}
    />
  )
}

export default ShiftKey
