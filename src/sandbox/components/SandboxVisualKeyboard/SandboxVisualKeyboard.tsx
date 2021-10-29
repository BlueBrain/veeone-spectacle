import "react-simple-keyboard/build/css/index.css"
import React, { useEffect, useRef, useState } from "react"
import VisualKeyboard from "../../../visualkeyboard/components/VisualKeyboard/VisualKeyboard"
import { Button } from "@material-ui/core"
import { generateRandomId } from "../../../common/random"
import ReactDOM from "react-dom"
import _ from "lodash"

class VisualKeyboardInstance {
  constructor(
    public id: string,
    public wrapper: HTMLElement,
    public target: HTMLElement
  ) {}

  public readonly removeElement = () => {
    console.log("removeElement from body", this.wrapper.id)
    const keyboardWrapperElement = document.getElementById(this.wrapper.id)
    if (keyboardWrapperElement) {
      keyboardWrapperElement.remove()
    } else {
      // todo raise not exists error
    }
  }
}

class VisualKeyboardService {
  private keyboards: Record<string, VisualKeyboardInstance> = {}
  private wrapperPrefix: string = "keyboard-wrapper-"

  public readonly newKeyboard = (
    target: HTMLElement,
    handleInputChange: (button) => void,
    options?: OpenVisualKeyboardOptions
  ) => {
    // Prevent from opening more than 1 keyboard per target
    const existingKeyboard = _.find(
      this.keyboards,
      (instance: VisualKeyboardInstance) => instance.target === target
    )
    if (existingKeyboard) {
      console.warn("Keyboard already exists on this target")
      return
    }

    const keyboardId = generateRandomId(8)
    const keyboardWrapperId = `${this.wrapperPrefix}${keyboardId}`
    const keyboardWrapper: HTMLElement = document.createElement("div")
    let parent

    console.log("Creating new keyboard", keyboardId)

    keyboardWrapper.id = keyboardWrapperId
    keyboardWrapper.style.position = "absolute"
    const targetRect = target.getBoundingClientRect()
    console.log("targetRect", targetRect)
    keyboardWrapper.style.left = `${targetRect.left}px`
    keyboardWrapper.style.top = `${targetRect.bottom}px`
    keyboardWrapper.style.marginTop = "10px"

    do {
      parent = parent?.parentElement || target?.parentElement
      console.log("parent.tagName ==", parent?.tagName)
    } while (!!parent && parent.tagName.toLowerCase() === "button")

    if (!parent) {
      throw new Error("no parent")
    }

    console.log("Open visual keyboard inside", parent)
    // parent.appendChild(keyboardWrapper)
    document.body.appendChild(keyboardWrapper)

    const keyboardComponent = (
      <VisualKeyboard
        identifier={keyboardWrapperId}
        onInputChange={handleInputChange}
        initialValue={options?.initialValue ?? ""}
        onEscape={() => this.closeKeyboard(keyboardId)}
      />
    )

    this.keyboards[keyboardId] = new VisualKeyboardInstance(
      keyboardId,
      keyboardWrapper,
      target
    )

    ReactDOM.render(keyboardComponent, keyboardWrapper)
  }

  public readonly closeKeyboard = keyboardId => {
    console.log("close keyboard", keyboardId)
    this.keyboards[keyboardId].removeElement()
    delete this.keyboards[keyboardId]
  }
}

const visualKeyboardService = new VisualKeyboardService()

interface OpenVisualKeyboardOptions {
  initialValue?: string
}

const SandboxVisualKeyboard: React.FC = () => {
  const closeVisualKeyboard = (keyboardWrapper: HTMLElement) => {
    console.log("closeVisualKeyboard", keyboardWrapper)
    document.body.removeChild(keyboardWrapper)
  }

  const openVisualKeyboard = (
    target,
    handleInputChange,
    options?: OpenVisualKeyboardOptions
  ) => {
    visualKeyboardService.newKeyboard(target, handleInputChange, options)
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
