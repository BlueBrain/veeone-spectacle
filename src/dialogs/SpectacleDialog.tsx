import { Dialog } from "@mui/material"
import React, { useEffect, useRef } from "react"
import { BaseDialog, DialogOptions } from "./DialogsContext"

interface SpectacleDialogProps {
  component: React.FC<BaseDialog> | React.NamedExoticComponent<BaseDialog>
  options: DialogOptions
  resolve: (value: any) => void
  reject: (reason: any) => void
}

const SpectacleDialog: React.FC<SpectacleDialogProps> = ({
  resolve,
  reject,
  component,
  options,
  children,
}) => {
  const { fullWidth = true, maxWidth = "sm", position } = options
  const DialogComponent = component
  const dialogRef = useRef()

  useEffect(() => {
    console.debug("dialogRef", dialogRef.current)
  }, [])

  return (
    <Dialog
      ref={dialogRef}
      open={true}
      onClose={reject}
      maxWidth={maxWidth}
      fullWidth={fullWidth}
      PaperProps={{
        sx: {
          position: "absolute",
          transform: `translate(-50%, -50%)`,
          left: position.left,
          top: position.top,
        },
      }}
    >
      <DialogComponent
        position={position}
        resolveDialog={resolve}
        cancelDialog={reject}
      />
    </Dialog>
  )
}

export default SpectacleDialog
