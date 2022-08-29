import React, { useMemo } from "react"
import { useDialogs } from "./DialogsContext"

const DialogsPlaceholder: React.FC = () => {
  const { activeDialogs } = useDialogs()

  const activeDialogComponents = useMemo(
    () =>
      activeDialogs.map((component, index) => (
        <div key={index}>{component}</div>
      )),
    [activeDialogs]
  )

  return <>{activeDialogComponents}</>
}

export default DialogsPlaceholder
