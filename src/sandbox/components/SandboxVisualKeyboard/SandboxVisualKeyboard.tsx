import "react-simple-keyboard/build/css/index.css"
import React, { useEffect, useState } from "react"
import { Button } from "@mui/material"
import { OpenVisualKeyboardOptions } from "../../../visualkeyboard/types"
import { useVisualKeyboard } from "../../../visualkeyboard/components/VisualKeyboardContext"

const SandboxVisualKeyboard: React.FC = () => {
  const { openKeyboard } = useVisualKeyboard()

  const openVisualKeyboard = (
    target,
    handleInputChange,
    options?: OpenVisualKeyboardOptions
  ) => {
    openKeyboard({
      target,
      onInputChange: handleInputChange,
      initial: options.initialValue,
    })
  }

  useEffect(() => {
    return () => {
      console.log("Destroy visual keyboard")
    }
  }, [])

  const [firstValue, setFirstValue] = useState("")

  const handleInputChange = (value: string) => {
    console.log("handleOnChange for component", value)
    // setFirstValue(value)
  }

  return (
    <div style={{ position: "absolute", top: "20vh", left: "10vw" }}>
      <div>
        <input
          type={"text"}
          value={firstValue}
          readOnly={true}
          onFocus={event =>
            openVisualKeyboard(
              event.target,
              (value: string) => {
                setFirstValue(value)
              },
              { initialValue: firstValue }
            )
          }
        />
        <Button
          variant={"contained"}
          onClick={event => openVisualKeyboard(event.target, handleInputChange)}
        >
          Open keyboard
        </Button>
      </div>
      <div style={{ position: "absolute", left: "600px" }}>
        <input
          type={"text"}
          onFocus={event => openVisualKeyboard(event.target, handleInputChange)}
        />
        <Button
          variant={"contained"}
          onClick={event => openVisualKeyboard(event.target, handleInputChange)}
        >
          Open keyboard
        </Button>
      </div>
    </div>
  )
}

export default SandboxVisualKeyboard
