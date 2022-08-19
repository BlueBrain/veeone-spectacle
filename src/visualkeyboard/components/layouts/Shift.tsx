import { Forward, Upload } from "@mui/icons-material"
import React from "react"
import { useKeyboard } from "../KeyboardContext"

const Shift: React.FC = () => {
  const { uppercaseModeLocked } = useKeyboard()
  return uppercaseModeLocked ? (
    <Upload />
  ) : (
    <Forward sx={{ transform: `rotate(-90deg)` }} />
  )
}

export default Shift
