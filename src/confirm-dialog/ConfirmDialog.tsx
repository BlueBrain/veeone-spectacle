import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material"
import React, { MouseEventHandler, useCallback, useMemo } from "react"
import { Position } from "../common/types"

interface ConfirmDialogOption {
  label: string
  action: "cancel" | MouseEventHandler
  color?:
    | "inherit"
    | "primary"
    | "secondary"
    | "success"
    | "error"
    | "info"
    | "warning"
  variant?: "text" | "outlined" | "contained"
}

type ConfirmDialogOptions = ConfirmDialogOption[]

interface ConfirmDialogProps {
  position: Position
  title?: string
  text?: string
  options: ConfirmDialogOptions
  onCancel: () => void
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  title = "Please confirm",
  text = "",
  position,
  options,
  onCancel,
}) => {
  const { left, top } = position

  const handleCancel = useCallback(() => {
    onCancel()
  }, [onCancel])

  const buttonOptions = useMemo(() => {
    return options.map((value, index) => (
      <Button
        onClick={value.action !== "cancel" ? value.action : handleCancel}
        autoFocus
        color={value.color ?? "primary"}
        key={index}
        variant={value.variant ?? "contained"}
      >
        {value.label}
      </Button>
    ))
  }, [handleCancel, options])

  return (
    <>
      <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {text}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel}>Cancel</Button>
        {buttonOptions}
      </DialogActions>
    </>
  )
}

export default ConfirmDialog
