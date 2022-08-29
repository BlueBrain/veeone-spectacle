import React, { createContext, useContext } from "react"
import { Position } from "../common/types"
import { Breakpoint } from "@mui/system"

type DialogResult = any

export interface DialogOptions {
  position: Position
  maxWidth?: Breakpoint | false
  fullWidth?: boolean
}

export type OpenDialogFunction = (
  component: React.FC<any> | React.NamedExoticComponent<any>,
  dialogOptions: DialogOptions
) => Promise<DialogResult>

export interface DialogsContextProps {
  activeDialogs: any[]
  openDialog: OpenDialogFunction
}

const DialogsContext = createContext(null)

export const useDialogs = () => useContext<DialogsContextProps>(DialogsContext)

export default DialogsContext
