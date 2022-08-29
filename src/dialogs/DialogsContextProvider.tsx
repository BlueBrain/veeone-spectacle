import React, { useCallback, useMemo, useState } from "react"
import DialogsContext, {
  DialogsContextProps,
  OpenDialogFunction,
} from "./DialogsContext"
import { generateRandomId } from "../common/random"
import SpectacleDialog from "./SpectacleDialog"

export interface DialogsContextProviderProps {}

const DialogsContextProvider: React.FC<DialogsContextProviderProps> = ({
  children,
}) => {
  const [activeDialogs, setActiveDialogs] = useState([])

  const openDialog = useCallback<OpenDialogFunction>(
    (DialogComponent, dialogOptions) =>
      new Promise((resolve, reject) => {
        const dialogId = generateRandomId()
        const newDialog = (
          <SpectacleDialog
            key={dialogId}
            component={DialogComponent}
            reject={reason => {
              reject(reason)
              closeDialog(dialogId)
            }}
            resolve={value => {
              resolve(value)
              closeDialog(dialogId)
            }}
            options={dialogOptions}
          />
        )
        setActiveDialogs(currentDialogs => {
          return [...currentDialogs, newDialog]
        })
      }),
    []
  )

  const closeDialog = dialogId => {
    console.debug("Closing dialog...", dialogId)
    setActiveDialogs(currentValue => {
      return currentValue.filter(value => value.key !== dialogId)
    })
  }

  const providerValue = useMemo<DialogsContextProps>(
    () => ({
      activeDialogs,
      openDialog,
    }),
    [activeDialogs, openDialog]
  )

  return (
    <DialogsContext.Provider value={providerValue}>
      {children}
    </DialogsContext.Provider>
  )
}

export default DialogsContextProvider
