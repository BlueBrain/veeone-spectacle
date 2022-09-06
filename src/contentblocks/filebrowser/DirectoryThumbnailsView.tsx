import React from "react"
import { BrowserDirectory, BrowserFile } from "../../veedrive/common/models"
import FileElement from "./FileElement"
import DirectoryElement from "./DirectoryElement"
import { Box } from "@mui/material"

interface DirectoryThumbnailsProps {
  files: BrowserFile[]
  dirs: BrowserDirectory[]
}

const DirectoryThumbnailsView: React.FC<DirectoryThumbnailsProps> = ({
  dirs,
  files,
}) => {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(5rem, 1fr))",
        gridGap: ".1rem",
        marginBottom: "1rem",

        "> .MuiBox-root": {
          // Whole grid element
          cursor: "pointer",
          boxSizing: "border-box",
          padding: ".3rem",
          overflow: "hidden",

          "> .Thumbnail.MuiBox-root": {
            // Thumbnail part container
            display: "flex",
            position: "relative",
            justifyContent: "center",
            width: "100%",

            "::before": {
              display: "block",
              content: '""',
              paddingBottom: "100%",
            },

            "> .ThumbnailBody.MuiBox-root": {
              // Thumbnail body
              display: "flex",
              width: "100%",
              aspectRatio: "1",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "3rem",

              "> .MuiSvgIcon-root": {
                // Icon
                width: "3.5rem",
                height: "3.5rem",
              },
            },
          },
          "> .Label.MuiBox-root": {
            whiteSpace: "normal",
            overflow: "hidden",
            fontSize: ".7rem",
            textAlign: "center",
            padding: ".4rem .2rem 0 .2rem",
          },
        },
      }}
    >
      {dirs.map(dir => (
        <DirectoryElement key={dir.path} dir={dir} />
      ))}
      {files.map((file: BrowserFile) => (
        <FileElement key={file.path} file={file} />
      ))}
    </Box>
  )
}

export default DirectoryThumbnailsView
