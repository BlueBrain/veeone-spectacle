import React, { createContext, useContext } from "react"
import { Position } from "../common/types"

type DialogResult = any

export interface BaseDialog {
  position: Position
  resolveDialog: (value: any) => void
  cancelDialog: (reason: any) => void
}

export type OpenDialogFunction = (
  component: React.FC<BaseDialog> | React.NamedExoticComponent<BaseDialog>,
  position: Position
) => Promise<DialogResult>

export interface DialogsContextProps {
  activeDialogs: any[]
  openDialog: OpenDialogFunction
}

const DialogsContext = createContext(null)

export const useDialogs = () => useContext<DialogsContextProps>(DialogsContext)

export default DialogsContext
