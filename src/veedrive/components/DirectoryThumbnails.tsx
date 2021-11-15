import React, { useContext } from "react"
import { FileBrowserContext } from "../contexts/FileBrowserContext"
import createStyles from "@mui/styles/createStyles"
import makeStyles from "@mui/styles/makeStyles"
import { BrowserDirectory, BrowserFile } from "../common/models"
import { Folder } from "@mui/icons-material"
import FileElement from "./FileElement"

interface DirectoryThumbnailsProps {
  files: BrowserFile[]
  dirs: BrowserDirectory[]
}

const useStyles = makeStyles(theme =>
  createStyles({
    root: {
      display: "flex",
      flexWrap: "wrap",
      justifyContent: "space-around",
      overflow: "scroll",
      backgroundColor: `#fff`,
    },
    grid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(7rem, 1fr))",
      gridGap: ".2rem",
      marginBottom: "1rem",
    },
    gridTile: {
      display: "grid",
      // background: "rgba(255,0,0,.1)",
      cursor: "pointer",
      boxSizing: "border-box",
      overflow: "hidden",
      "&:hover": {
        background: "#eee",
      },
    },
    gridTileThumbnail: {
      position: "relative",
      height: 0,
      // background: "rgba(0,255,255,.3)",
      overflow: "hidden",
      display: "flex",
      justifyContent: "center",
      width: "100%",
      paddingBottom: "100%",
    },
    gridTileThumbnailBody: {
      width: "100%",
      height: "100%",
      paddingTop: "50%",
      paddingLeft: ".4rem",
      paddingRight: ".4rem",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "3rem",
    },
    gridTileLabel: {
      // background: "rgba(0,0,255,.1)",
      whiteSpace: "nowrap",
      textOverflow: "ellipsis",
      overflow: "hidden",
      fontSize: ".8rem",
      textAlign: "center",
      padding: "0 .4rem",
    },
    gridTileIcon: {
      width: "1.5em",
      height: "1.5em",
    },
  })
)

const DirectoryThumbnails: React.FC<DirectoryThumbnailsProps> = ({
  dirs,
  files,
}) => {
  const classes = useStyles()
  const { navigateDirectory } = useContext(FileBrowserContext)

  return (
    <>
      <div className={classes.grid}>
        {dirs.map(dir => (
          <div
            key={dir.name}
            className={classes.gridTile}
            onClick={() => navigateDirectory(dir.path)}
            title={dir.name}
          >
            <div className={classes.gridTileThumbnail}>
              <div className={classes.gridTileThumbnailBody}>
                <Folder fontSize={"large"} className={classes.gridTileIcon} />
              </div>
            </div>
            <div className={classes.gridTileLabel}>{dir.name}</div>
          </div>
        ))}
        {files.map((file: BrowserFile) => (
          <FileElement key={file.path} file={file} classes={classes} />
        ))}
      </div>
    </>
  )
}

export default DirectoryThumbnails
