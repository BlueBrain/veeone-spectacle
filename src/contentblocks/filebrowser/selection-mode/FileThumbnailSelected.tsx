import React from "react"
import { CheckBox, CheckBoxOutlineBlank } from "@mui/icons-material"
import { useFileBrowserSelectionMode } from "./FileBrowserSelectionModeContext"
import { alpha, Box } from "@mui/material"

interface FileThumbnailSelectedProps {
  isSelected: boolean
}

const FileThumbnailSelected: React.FC<FileThumbnailSelectedProps> = ({
  isSelected,
}) => {
  const { isSelectionModeEnabled } = useFileBrowserSelectionMode()

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        position: "absolute",
        right: 0,
        top: 0,
        transform: "scale(1.1)",
      }}
    >
      {isSelectionModeEnabled ? (
        <>
          <Box
            sx={[
              {
                display: "flex",
                position: "absolute",
                left: "0",
                top: "0",
                width: "100%",
                height: "100%",
                border: "1px solid",
                boxSizing: "border-box",
                borderRadius: ".3rem",
                transition: "background ease 600ms",
              },
              theme => ({
                borderColor: alpha(theme.palette.primary.main, 0.3),
                backgroundColor: alpha(theme.palette.primary.main, 0),
                ...(isSelected
                  ? {
                      borderColor: alpha(theme.palette.primary.main, 0.5),
                      backgroundColor: alpha(theme.palette.primary.main, 0.3),
                    }
                  : {}),
              }),
            ]}
          />
          <Box
            sx={{
              display: "flex",
              position: "absolute",
              right: "0",
              top: "0",
              color: "primary.dark",
              padding: ".2rem",
            }}
          >
            {isSelected ? <CheckBox /> : <CheckBoxOutlineBlank />}
          </Box>
        </>
      ) : null}
    </Box>
  )
}

export default FileThumbnailSelected
