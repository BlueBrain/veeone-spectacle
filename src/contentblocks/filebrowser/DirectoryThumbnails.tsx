import React from "react"
import { BrowserDirectory, BrowserFile } from "../../veedrive/common/models"
import FileElement from "./FileElement"
import DirectoryElement from "./DirectoryElement"
import { Box } from "@mui/material"

interface DirectoryThumbnailsProps {
  files: BrowserFile[]
  dirs: BrowserDirectory[]
}

const DirectoryThumbnails: React.FC<DirectoryThumbnailsProps> = ({
  dirs,
  files,
}) => {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(6rem, 1fr))",
        gridGap: ".2rem",
        marginBottom: "1rem",

        "> .MuiBox-root": {
          // Whole grid element
          // display: "grid",
          // background: "rgba(255, 0, 0, .1)",
          cursor: "pointer",
          boxSizing: "border-box",
          padding: ".3rem",
          overflow: "hidden",

          "> .Thumbnail.MuiBox-root": {
            // Thumbnail part container
            display: "flex",
            position: "relative",
            // height: 0,
            // overflow: "hidden",
            justifyContent: "center",
            width: "100%",
            // paddingBottom: "100%",

            "::before": {
              display: "block",
              content: '""',
              paddingBottom: "100%",
            },

            "> .ThumbnailBody.MuiBox-root": {
              // Thumbnail body
              display: "flex",
              width: "100%",
              // height: "100%",
              aspectRatio: "1",
              // background: "rgba(0, 255, 255, .4)",
              // paddingTop: "50%",
              // paddingLeft: ".2rem",
              // paddingRight: ".2rem",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "3rem",

              "> .MuiSvgIcon-root": {
                // Icon
                width: "2em",
                height: "2em",
              },
            },
          },
          "> .Label.MuiBox-root": {
            // whiteSpace: "nowrap",
            // textOverflow: "ellipsis",
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

export default DirectoryThumbnails
