import React, { useMemo } from "react"
import { CheckBox, CheckBoxOutlineBlank } from "@mui/icons-material"
import { createStyles, makeStyles } from "@mui/styles"
import { useFileBrowserSelectionMode } from "./FileBrowserSelectionModeContext"
import { alpha, Theme } from "@mui/material"

interface FileThumbnailSelectedProps {
  isSelected: boolean
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {},
    checkbox: {
      display: "flex",
      position: "absolute",
      right: "0",
      top: "0",
    },
    overlay: {
      display: "flex",
      position: "absolute",
      left: "0",
      top: "0",
      width: "100%",
      height: "100%",
      border: "2px solid",
      boxSizing: "border-box",
      borderColor: alpha(theme.palette.primary.main, 0.5),
      transition: "background ease 200ms",
      backgroundColor: alpha(theme.palette.primary.main, 0),
    },
    selected: {
      "& $overlay": {
        background: alpha(theme.palette.primary.main, 0.6),
      },
    },
  })
)

const FileThumbnailSelected: React.FC<FileThumbnailSelectedProps> = ({
  isSelected,
  children,
}) => {
  const classes = useStyles()
  const { isSelectionModeEnabled } = useFileBrowserSelectionMode()

  const rootClasses = useMemo(() => {
    const cssList = [classes.root]
    if (isSelected) {
      cssList.push(classes.selected)
    }
    return cssList
  }, [isSelected, classes])

  return (
    <div className={rootClasses.join(" ")}>
      {children}
      {isSelectionModeEnabled ? (
        <>
          <div className={classes.overlay} />
          <div className={classes.checkbox}>
            {isSelected ? <CheckBox /> : <CheckBoxOutlineBlank />}
          </div>
        </>
      ) : null}
    </div>
  )
}

export default FileThumbnailSelected
