import React, { useCallback, useMemo, useState } from "react"
import DialogsContext, {
  DialogsContextProps,
  OpenDialogFunction,
} from "./DialogsContext"
import { Dialog } from "@mui/material"
import { generateRandomId } from "../common/random"

export interface DialogsContextProviderProps {}

const DialogsContextProvider: React.FC<DialogsContextProviderProps> = ({
  children,
}) => {
  const [activeDialogs, setActiveDialogs] = useState([])

  const openDialog = useCallback<OpenDialogFunction>(
    (DialogComponent, position) =>
      new Promise((resolve, reject) => {
        const dialogId = generateRandomId()
        const cancelDialog = () => {
          console.debug("Close dialog...")
          reject("cancel")
          closeDialog(dialogId)
        }

        const resolveDialog = (value: any) => {
          resolve(value)
          closeDialog(dialogId)
        }

        const newDialog = (
          <Dialog
            key={dialogId}
            open={true}
            onClose={cancelDialog}
            fullWidth={true}
            PaperProps={{
              sx: {
                position: "absolute",
                transform: "translate(-50%, -50%)",
                left: position.left,
                top: position.top,
              },
            }}
          >
            <DialogComponent
              position={position}
              resolveDialog={resolveDialog}
              cancelDialog={cancelDialog}
            />
          </Dialog>
        )

        setActiveDialogs(currentDialogs => {
          return [...currentDialogs, newDialog]
        })
      }),
    []
  )

  const closeDialog = dialogId => {
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
