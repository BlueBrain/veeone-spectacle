import React, { useContext } from "react"
import { FileBrowserContext } from "../../contexts/FileBrowserContext"
import { DirectoryItem } from "../../types"
import { createStyles, makeStyles } from "@material-ui/core"
import { BrowserFile } from "../../common/models"
import { Folder } from "@material-ui/icons"
import FileElement from "./FileElement"

interface DirectoryThumbnailsProps {
  files: BrowserFile[]
  dirs: DirectoryItem[]
}

// const StyledGridLayout = styled.div`
//   display: grid;
//   grid-template-columns: repeat(auto-fill, minmax(5rem, 1fr));
//   grid-gap: 1rem;
//   margin-bottom: 1rem;
// `
//
// const StyledGridElement = styled.div`
//   display: grid;
//   padding: 0.5rem;
//   background: #fff;
//   cursor: pointer;
//   box-sizing: border-box;
//   font-size: 8pt;
//   line-height: 1em;
//   // box-shadow: -0.2rem 0.3rem 0.5rem rgba(0, 0, 0, 0.04),
//   //   0.2rem 0.3rem 0.5rem rgba(0, 0, 0, 0.04);
//   // border-radius: 0.3rem;
//
//   ::before,
//   div {
//     width: 100%;
//     height: 100%;
//     grid-area: 1 / 1 / 2 / 2;
//   }
//
//   ::before {
//     content: "";
//     padding-bottom: 100%;
//     display: block;
//   }
// `

// const StyledDirElement = styled.div`
//   display: flex;
//   flex-direction: column;
//
// `

const useStyles = makeStyles(theme =>
  createStyles({
    root: {
      display: "flex",
      flexWrap: "wrap",
      justifyContent: "space-around",
      overflow: "scroll",
      backgroundColor: theme.palette.background.paper,
    },
    grid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(5rem, 1fr))",
      gridGap: ".2rem",
      marginBottom: "1rem",
    },
    gridTile: {
      display: "grid",
      // padding: "0.1rem",
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
    }
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
        {files.map((file, i) => (
          <FileElement key={i} file={file} classes={classes} />
        ))}
      </div>
    </>
  )
}

export default DirectoryThumbnails
