import { Dialog, Paper, PaperProps } from "@mui/material"
import React, { useCallback, useEffect, useRef } from "react"
import { BaseDialog, DialogOptions } from "./DialogsContext"
import { useConfig } from "../config/AppConfigContext"
import { ApplicationConfig } from "../config/types"

interface SpectacleDialogProps {
  component: React.FC<BaseDialog> | React.NamedExoticComponent<BaseDialog>
  options: DialogOptions
  resolve: (value: any) => void
  reject: (reason: any) => void
}

const fixBoxPosition = (ref: HTMLDivElement, config: ApplicationConfig) => {
  // TODO fix this
  const parentRect = ref.offsetParent.getBoundingClientRect()
  console.debug("PARENT DESK", parentRect)
  const leftEdge = ref.offsetLeft - ref.offsetWidth / 2
  const rightEdge = parentRect.width - ref.offsetLeft + ref.offsetWidth / 2
  const topEdge = ref.offsetTop - ref.offsetHeight / 2
  const bottomEdge = ref.offsetHeight / 2 - ref.offsetTop
  console.debug("BOX CHECK", { leftEdge, topEdge, rightEdge, bottomEdge })
}

const PaperComponent: React.FC<PaperProps> = props => {
  const paperRef = useRef()
  const config = useConfig()
  useEffect(() => {
    const currentPaperRef = paperRef.current as HTMLDivElement
    if (currentPaperRef) {
      // Correct paper component (dialog window) position if too close to the edge
      fixBoxPosition(currentPaperRef, config)
    }
  })

  return <Paper {...props} ref={paperRef} />
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

  return (
    <Dialog
      open={true}
      onClose={reject}
      maxWidth={maxWidth}
      fullWidth={fullWidth}
      PaperComponent={PaperComponent}
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
