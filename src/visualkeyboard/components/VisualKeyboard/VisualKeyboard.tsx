import Keyboard from "react-simple-keyboard"
import "react-simple-keyboard/build/css/index.css"
import React, { useEffect, useRef, useState } from "react"
import createStyles from "@mui/styles/createStyles"
import makeStyles from "@mui/styles/makeStyles"
import styled from "styled-components"

type KeyboardLayout = "default" | "shift" | "caps"
type ShiftMode = "lower" | "upper" | "lock"

const SHIFT_MODES: ShiftMode[] = ["lower", "upper", "lock"]

const KEYBOARD_LAYOUTS = {
  default: [
    "{esc} ` 1 2 3 4 5 6 7 8 9 0 - = {bksp}",
    "{tab} q w e r t y u i o p [ ] \\",
    "{capslock} a s d f g h j k l ; ' {enter}",
    "{shift} z x c v b n m , . / {shift}",
    ".com @ {space}",
  ],
  shift: [
    "{esc} ~ ! @ # $ % ^ & * ( ) _ + {bksp}",
    "{tab} Q W E R T Y U I O P { } |",
    '{capslock} A S D F G H J K L : " {enter}',
    "{shift} Z X C V B N M < > ? {shift}",
    ".com @ {space}",
  ],
  caps: [
    "{esc} ` 1 2 3 4 5 6 7 8 9 0 - = {bksp}",
    "{tab} Q W E R T Y U I O P [ ] \\",
    "{capslock} A S D F G H J K L ; ' {enter}",
    "{shift} Z X C V B N M , . / {shift}",
    ".com @ {space}",
  ],
}

const StyledKeyboard = styled.div`
  box-shadow: 4px 4px 10px rgba(0, 0, 0, 0.2);
`

const useStyles = makeStyles(theme =>
  createStyles({
    shiftButtonUpper: {
      background: "#aaa !important",
    },
    shiftButtonLock: {
      background: "red !important",
    },
    capsLockButtonActive: {
      background: "red !important",
    },
  })
)

interface VisualKeyboardProps {
  identifier: string
  initialValue?: string
  onEscape: () => void
  onInputChange: (button) => void
}

export const VisualKeyboard: React.FC<VisualKeyboardProps> = ({
  onEscape,
  initialValue = "",
  identifier,
  onInputChange,
}) => {
  const classes = useStyles()
  const [value, setValue] = useState<string>(initialValue)
  const [shiftMode, setShiftMode] = useState<ShiftMode>(SHIFT_MODES[0])
  const [capsLock, setCapsLock] = useState<boolean>(false)
  const keyboardRef = useRef()

  useEffect(() => {
    onInputChange(value)
  }, [value, onInputChange])

  const handleInputChange = input => {
    console.log("Input changed", input)
    setValue(input)
  }

  const handleKeyPress = button => {
    console.log("Button pressed", `"${button}"`)
    switch (button) {
      case "{shift}": {
        toggleShift()
        break
      }
      case "{capslock}": {
        toggleCapsLock()
        break
      }
      case "{esc}": {
        onEscape()
        break
      }
      case "{bksp}": {
        setValue(prevValue => prevValue.slice(0, -1))
        break
      }
      default: {
        if (shiftMode === "upper") {
          setShiftMode(SHIFT_MODES[0])
        }
        break
      }
    }
  }

  const toggleShift = () => {
    let newShiftModeIndex = SHIFT_MODES.indexOf(shiftMode) + 1
    if (newShiftModeIndex >= SHIFT_MODES.length) {
      newShiftModeIndex = 0
    }
    setShiftMode(SHIFT_MODES[newShiftModeIndex])
  }

  const toggleCapsLock = () => {
    setCapsLock(!capsLock)
  }

  const SHIFT_MODE_TO_BUTTON_CLASS = {
    upper: classes.shiftButtonUpper,
    lock: classes.shiftButtonLock,
  }

  const buttonTheme = [
    ...(shiftMode !== "lower"
      ? [
          {
            class: SHIFT_MODE_TO_BUTTON_CLASS[shiftMode],
            buttons: "{shift}",
          },
        ]
      : []),
    ...(capsLock
      ? [
          {
            class: classes.capsLockButtonActive,
            buttons: "{capslock}",
          },
        ]
      : []),
  ]

  let layoutName: KeyboardLayout = "default"

  if (shiftMode === "upper" || shiftMode === "lock") {
    layoutName = "shift"
  } else if (capsLock) {
    layoutName = "caps"
  }

  useEffect(() => {
    // @ts-ignore
    keyboardRef?.current?.setInput(initialValue)
  }, [initialValue])

  return (
    <StyledKeyboard>
      <Keyboard
        onChange={handleInputChange}
        onKeyPress={handleKeyPress}
        layout={KEYBOARD_LAYOUTS}
        layoutName={layoutName}
        buttonTheme={buttonTheme}
        baseClass={`keyboard-${identifier}`}
        keyboardRef={r => (keyboardRef.current = r)}
      />
    </StyledKeyboard>
  )
}
