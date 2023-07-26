import { Dialog, Paper, PaperProps } from "@mui/material"
import React, { useCallback, useEffect, useMemo, useRef } from "react"
import { DialogOptions } from "./DialogsContext"
import ActiveDialogContextProvider from "./ActiveDialogContextProvider"
import { useConfig } from "../config/AppConfigContext"
import { useSpectacle } from "../spectacle/SpectacleStateContext"

interface SpectacleDialogProps {
  component: React.FC | React.NamedExoticComponent
  options: DialogOptions
  resolve: (value: any) => void
  reject: (reason: any) => void
}

const PaperComponent: React.FC<PaperProps> = props => {
  const config = useConfig()
  const paperRef = useRef()

  const fixBoxPosition = useCallback(() => {
    const modalRef = paperRef.current as HTMLDivElement
    const modalRect = modalRef.getBoundingClientRect()
    const deskRect = modalRef.offsetParent.getBoundingClientRect()

    const leftEdge = modalRef.offsetLeft - modalRef.offsetWidth / 2
    const rightEdge = deskRect.width - modalRect.width - leftEdge
    const topEdge = modalRef.offsetTop - modalRef.offsetHeight / 2
    const bottomEdge = deskRect.height - modalRect.height - topEdge

    let transform = `translate(-50%, -50%) `

    if (leftEdge < config.DIALOG_SAFETY_MARGIN_HORIZONTAL_PX) {
      transform += `translateX(${
        -leftEdge + config.DIALOG_SAFETY_MARGIN_HORIZONTAL_PX
      }px) `
    } else if (rightEdge < config.DIALOG_SAFETY_MARGIN_HORIZONTAL_PX) {
      transform += `translateX(${
        rightEdge - config.DIALOG_SAFETY_MARGIN_HORIZONTAL_PX
      }px) `
    }

    if (topEdge < config.DIALOG_SAFETY_MARGIN_VERTICAL_PX) {
      transform += `translateY(${
        -topEdge + config.DIALOG_SAFETY_MARGIN_VERTICAL_PX
      }px) `
    } else if (bottomEdge < config.DIALOG_SAFETY_MARGIN_VERTICAL_PX) {
      transform += `translateY(${
        bottomEdge - config.DIALOG_SAFETY_MARGIN_VERTICAL_PX
      }px) `
    }
    modalRef.style.transform = transform
  }, [
    config.DIALOG_SAFETY_MARGIN_HORIZONTAL_PX,
    config.DIALOG_SAFETY_MARGIN_VERTICAL_PX,
  ])

  useEffect(() => {
    const currentPaperRef = paperRef.current as HTMLDivElement
    if (currentPaperRef) {
      // Correct paper component (dialog window) position if too close to the edge
      fixBoxPosition()
    }
  }, [fixBoxPosition, props])

  return <Paper {...props} ref={paperRef} />
}

const SpectacleDialog: React.FC<SpectacleDialogProps> = ({
  resolve,
  reject,
  component,
  options,
}) => {
  const { presentationStore } = useSpectacle()
  const { fullWidth = true, maxWidth = "sm", position } = options
  const DialogComponent = component

  const { left, top } = useMemo(
    () =>
      position !== null
        ? { left: position.left, top: position.top }
        : { left: "50%", top: "50%" },
    [position]
  )

  return (
    <ActiveDialogContextProvider
      dialogOptions={options}
      resolveDialog={resolve}
      cancelDialog={reject}
    >
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
            left,
            top,
          },
        }}
      >
        <DialogComponent />
      </Dialog>
    </ActiveDialogContextProvider>
  )
}

export default SpectacleDialog
