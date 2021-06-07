import styled from "styled-components"
import React, { useEffect, useState } from "react"
import FileBrowserDirectories from "./FileBrowserDirectories"
import FileBrowserDirectoryContent from "./FileBrowserDirectoryContent"
import fileService from "../../service"
import { DirectoryItem, VeeDriveListDirectoryFile } from "../../types"
import FileBrowserTopbar from "./FileBrowserTopbar"
import _ from "lodash"
import { BrowserDirectory, BrowserFile } from "../../common/models"
import {
  ContentBlockProps,
  ContentBlockTypes,
} from "../../../contentblocks/types"
import { useDispatch, useSelector } from "react-redux"
import { addFrame } from "../../../core/redux/actions"
import { generateFrameId } from "../../../core/frames/utils"
import {
  FrameSituation,
  PresentationStateData,
} from "../../../core/presentations/interfaces"
import { getFrame } from "../../../core/redux/selectors"

const StyledFileBrowserBlock = styled.div`
  background: #fafafa;
  width: 100%;
  height: 100%;
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.3);
`

const StyledBlockContent = styled.div`
  width: 100%;
  height: calc(100% - 4.5rem);
`

const StyledMain = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  flex: 1;
`

const FileBrowserBlock: React.FC<ContentBlockProps> = ({ frameId }) => {
  const [directoryTree, setDirectoryTree] = useState([] as BrowserDirectory[])
  const [currentFiles, setCurrentFiles] = useState([] as BrowserFile[])
  const [currentDirs, setCurrentDirs] = useState([] as BrowserDirectory[])
  const [activePath, setActivePath] = useState("")

  const situation = (useSelector<PresentationStateData>(
    state => getFrame(state, frameId).situation
  ) as unknown) as FrameSituation

  const dispatch = useDispatch()

  const newImageFrame = filePath => {
    dispatch(
      addFrame({
        type: ContentBlockTypes.Image,
        frameId: generateFrameId(),
        position: {
          top: situation.top + situation.height / 2,
          left: situation.left + situation.width / 2,
        },
        contentData: {
          path: filePath,
        },
      })
    )
  }

  const load = async () => {
    const paths = activePath.split("/")
    let path = ""
    const tree = await listDirectory("")
    let currentDirList = tree.dirs
    let files = tree.files

    for (const p of paths) {
      if (p === "") {
        break
      }
      path += `${p}/`
      console.debug("load: path=", path)
      const dirList = await listDirectory(path)
      files = dirList.files
      console.debug("loaded dirs", dirList)
      const target = _.find(currentDirList, dir => dir.name === p)
      if (target !== undefined) {
        target.directories = dirList.dirs
      }
      currentDirList = dirList.dirs
    }
    console.debug("TREE=", tree)
    setDirectoryTree(tree.dirs)
    setCurrentDirs(tree.dirs)
    setCurrentFiles(mapBrowserFiles(files, activePath))
  }

  const mapBrowserFiles = (
    fileList: VeeDriveListDirectoryFile[],
    dir: string
  ) =>
    fileList.map(f => new BrowserFile({ name: f.name, size: f.size, dir: dir }))

  const listDirectory = async dirPath => {
    console.debug("listDirectory", dirPath)
    const response = await fileService.listDirectory({ path: dirPath })
    const pathPrefix = dirPath !== "" ? `${dirPath}/` : ``
    let dirs
    try {
      const dirsList = response.directories.map(
        path => new BrowserDirectory(`${pathPrefix}${path}`)
      )
      dirs = _.sortBy(dirsList, "name")
    } catch (err) {
      // todo this error should be logged/reported
      console.error(err)
      return { dirs: [], files: [] }
    }
    const files = response.files
    return { dirs, files }
  }

  const openDirectory = async dirPath => {
    const { dirs, files } = await listDirectory(dirPath)
    const newDirTree = [...directoryTree]
    const parts = dirPath.split("/") as string[]
    let targetDir: DirectoryItem[] = newDirTree
    let dir: DirectoryItem | undefined
    for (const part of parts) {
      dir = _.find(targetDir, dir => dir.name === part)
      if (dir !== undefined) {
        targetDir = dir.directories
      } else {
        break
      }
    }
    if (dir !== undefined) {
      if (dir.directories === undefined || dir.directories.length === 0) {
        dir.directories = dirs
      } else {
        dir.directories = []
      }
      setDirectoryTree(newDirTree)
    }

    setActivePath(dirPath)
    setCurrentFiles(mapBrowserFiles(files, dirPath))
    setCurrentDirs(dirs)
  }

  const openUpperDirectory = async () => {
    const upperPath = activePath.split("/").slice(0, -1).join("/")
    await openDirectory(upperPath)
  }

  const openDirectoryByPathPartIndex = async (pathPartIndex: number) => {
    const path = activePath.split("/").slice(0, pathPartIndex).join("/")
    console.debug("goToDirectoryByIndex", pathPartIndex, `'${path}'`)
    return await openDirectory(path)
  }

  const openFile = (filename: string) => {
    const filePath = `${activePath}/${filename}`
    console.debug(`Requesting a file from frame=${frameId}`, filePath)
    // todo handle different file types (currently all will open an image frame)
    setTimeout(() => newImageFrame(filePath))
  }

  useEffect(() => {
    return void load()
  }, [])

  return (
    <StyledFileBrowserBlock onWheel={event => event.stopPropagation()}>
      <StyledBlockContent>
        <FileBrowserTopbar
          activePath={activePath}
          onSelectPathPart={openDirectoryByPathPartIndex}
        />
        <StyledMain>
          <FileBrowserDirectories
            dirs={directoryTree}
            activePath={activePath}
            onOpenDirectory={openDirectory}
          />
          <FileBrowserDirectoryContent
            dirs={currentDirs}
            files={currentFiles}
            onOpenFile={openFile}
            onOpenUpperDirectory={openUpperDirectory}
            onOpenDirectory={openDirectory}
          />
        </StyledMain>
      </StyledBlockContent>
    </StyledFileBrowserBlock>
  )
}

export default FileBrowserBlock
