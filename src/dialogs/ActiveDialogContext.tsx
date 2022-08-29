import { createContext, useContext } from "react"
import { DialogOptions } from "./DialogsContext"

export interface ActiveDialogContextProps {
  dialogOptions: DialogOptions
  resolveDialog: (value: any) => void
  cancelDialog: (reason: any) => void
}

export const ActiveDialogContext = createContext<ActiveDialogContextProps>(null)

export const useActiveDialog = () => useContext(ActiveDialogContext)
