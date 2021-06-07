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
import { addFrame, updateFrameData } from "../../../core/redux/actions"
import { generateFrameId } from "../../../core/frames/utils"
import {
  FrameEntry,
  PresentationStateData,
} from "../../../core/presentations/interfaces"
import { getFrame } from "../../../core/redux/selectors"
import {
  FileBrowserContext,
  FileBrowserContextProps,
} from "../../contexts/filebrowser-context"
import { FileBrowserBlockPayload } from "../../common/types"

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
  const dispatch = useDispatch()

  const frameData = (useSelector<PresentationStateData>(state =>
    getFrame(state, frameId)
  ) as unknown) as FrameEntry

  const situation = frameData.situation
  const blockData = (frameData.data as unknown) as FileBrowserBlockPayload
  const history = blockData?.history ?? [""]
  const historyIndex = blockData?.historyIndex ?? 0
  const activePath = history[historyIndex]

  const [directoryTree, setDirectoryTree] = useState([] as BrowserDirectory[])
  const [currentFiles, setCurrentFiles] = useState([] as BrowserFile[])
  const [currentDirs, setCurrentDirs] = useState([] as BrowserDirectory[])

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

    addToBrowsingHistory(dirPath)
    setCurrentFiles(mapBrowserFiles(files, dirPath))
    setCurrentDirs(dirs)
  }

  const addToBrowsingHistory = dirPath => {
    const newHistory = [dirPath, ...history.slice(historyIndex)]
    const newHistoryIndex = 0
    const newFrameData: FileBrowserBlockPayload = {
      history: newHistory,
      historyIndex: newHistoryIndex,
    }
    console.debug("addToBrowsingHistory", newFrameData)
    dispatch(updateFrameData(frameId, newFrameData))
  }

  const openParentDirectory = async () => {
    const upperPath = activePath.split("/").slice(0, -1).join("/")
    await openDirectory(upperPath)
  }

  const openDirectoryByPathPartIndex = async (pathPartIndex: number) => {
    const path = activePath.split("/").slice(0, pathPartIndex).join("/")
    console.debug("goToDirectoryByIndex", pathPartIndex, `'${path}'`)
    return await openDirectory(path)
  }

  const moveBrowsingHistoryIndex = (delta: number) => {
    let newHistoryIndex = historyIndex + delta
    if (newHistoryIndex < 0) {
      newHistoryIndex = 0
    }
    if (newHistoryIndex + 1 >= history.length) {
      newHistoryIndex = history.length - 1
    }
    const newFrameData: FileBrowserBlockPayload = {
      history: history,
      historyIndex: newHistoryIndex,
    }
    dispatch(updateFrameData(frameId, newFrameData))
  }

  const openPreviousDirectory = async () => {
    moveBrowsingHistoryIndex(1)
  }

  const openNextDirectory = async () => {
    moveBrowsingHistoryIndex(-1)
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

  const fileBrowserContextProvider: FileBrowserContextProps = {
    navigateUp() {
      void openParentDirectory()
    },
    navigateBack() {
      void openPreviousDirectory()
    },
    navigateForward() {
      void openNextDirectory()
    },
  }

  return (
    <FileBrowserContext.Provider value={fileBrowserContextProvider}>
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
              onOpenUpperDirectory={openParentDirectory}
              onOpenDirectory={openDirectory}
            />
          </StyledMain>
        </StyledBlockContent>
      </StyledFileBrowserBlock>
    </FileBrowserContext.Provider>
  )
}

export default FileBrowserBlock
