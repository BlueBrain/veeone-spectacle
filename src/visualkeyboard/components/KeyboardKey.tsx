import { Button, Grid } from "@mui/material"
import React, { useCallback } from "react"
import { OverridableStringUnion } from "@mui/types"
import { ButtonPropsColorOverrides } from "@mui/material/Button/Button"
import { useKeyboard } from "./KeyboardContext"

interface KeyboardKeyProps {
  symbol: string
  grow?: number
  color?: OverridableStringUnion<
    | "inherit"
    | "primary"
    | "secondary"
    | "success"
    | "error"
    | "info"
    | "warning",
    ButtonPropsColorOverrides
  >
}

const KeyboardKey: React.FC<KeyboardKeyProps> = ({
  symbol,
  color = "secondary",
  grow = 1,
}) => {
  const keyboard = useKeyboard()

  const triggerButton = useCallback(() => {
    console.debug("key pressed")
    keyboard.onButtonPressed({
      symbol,
    })
  }, [keyboard, symbol])

  const optionalProps = {
    ...(color ? { color } : {}),
  }

  return (
    <Grid item sx={{ display: `flex`, flexGrow: grow, padding: `0 0.2rem` }}>
      <Button
        onClick={triggerButton}
        variant={"contained"}
        {...optionalProps}
        sx={{
          minWidth: `1rem`,
          display: `flex`,
          flexGrow: 1,
          padding: `0.4rem`,
          textTransform: `none`,
        }}
      >
        {symbol}
      </Button>
    </Grid>
  )
}

export default KeyboardKey
