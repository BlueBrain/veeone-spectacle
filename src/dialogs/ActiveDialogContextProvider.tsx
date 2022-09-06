import {
  ActiveDialogContext,
  ActiveDialogContextProps,
} from "./ActiveDialogContext"
import React, { useMemo } from "react"
import { DialogOptions } from "./DialogsContext"

interface ActiveDialogContextProviderProps {
  dialogOptions: DialogOptions
  resolveDialog: (value: any) => void
  cancelDialog: (reason: any) => void
}

const ActiveDialogContextProvider: React.FC<ActiveDialogContextProviderProps> = ({
  dialogOptions,
  resolveDialog,
  cancelDialog,
  children,
}) => {
  const providerValue: ActiveDialogContextProps = useMemo(
    () => ({
      dialogOptions,
      resolveDialog,
      cancelDialog,
    }),
    [cancelDialog, dialogOptions, resolveDialog]
  )
  return (
    <ActiveDialogContext.Provider value={providerValue}>
      {children}
    </ActiveDialogContext.Provider>
  )
}

export default ActiveDialogContextProvider
