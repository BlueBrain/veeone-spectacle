import styled from "styled-components"
import React, { useEffect, useState } from "react"
import FileBrowserDirectories from "./FileBrowserDirectories"
import FileBrowserDirectoryContent from "./FileBrowserDirectoryContent"
import fileService from "../../service"
import { DirectoryItem, FileItem, VeeDriveListDirectoryFile } from "../../types"
import FileBrowserTopbar from "./FileBrowserTopbar"
import _ from "lodash"

interface FileBrowserBlockProps {
}

class BrowserFile implements FileItem {
  name: string
  size: number
}

class BrowserDirectory implements DirectoryItem {
  public name: string
  public directories: BrowserDirectory[]
  public files: BrowserFile[]

  constructor(public path: string) {
    this.name = path.split("/").pop() as string
  }
}


const StyledFileBrowserBlock = styled.div`
  background: #fff;
  width: 100%;
  height: 100%;
  box-shadow: 0 5px 10px rgba(0, 0, 0, .3);
`

const StyledBlockContent = styled.div`
  width: 100%;
  height: calc(100% - 50px);
`

const StyledMain = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  flex: 1;
`


const FileBrowserBlock: React.FC<FileBrowserBlockProps> = () => {
  const [directoryTree, setDirectoryTree] = useState([] as DirectoryItem[])
  const [currentFiles, setCurrenyFiles] = useState([] as VeeDriveListDirectoryFile[])
  const [currentDirs, setCurrentDirs] = useState([] as DirectoryItem[])
  // const [activePath, setActivePath] = useState("Downloads/SimpleDragging/Modernizr")
  const [activePath, setActivePath] = useState("gitflow/gitflow")

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
      const target = _.find(currentDirList, (dir) => dir.name === p)
      if (target !== undefined) {
        target.directories = dirList.dirs
      }
      currentDirList = dirList.dirs
    }
    console.debug("TREE=", tree)
    setDirectoryTree(tree.dirs)

    // const response = await fileService.listDirectory({ path: activePath })
    // const dirs = response.directories.map((path) => new BrowserDirectory(path))
    // setDirs(_.sortBy(dirs, "name"))
    setCurrenyFiles(files)
  }

  const listDirectory = async (dirPath) => {
    console.debug("listDirectory", dirPath)
    const response = await fileService.listDirectory({ path: dirPath })
    const pathPrefix = dirPath !== "" ? `${dirPath}/` : ``
    const dirsList = response.directories.map((path) => new BrowserDirectory(`${pathPrefix}${path}`))
    const files = response.files
    const dirs = _.sortBy(dirsList, 'name')
    return { dirs, files }
  }

  const openDirectory = async (dirPath) => {
    const { dirs, files } = await listDirectory(dirPath)
    const newDirTree = [...directoryTree]
    const parts = dirPath.split("/") as string[]
    let targetDir: DirectoryItem[] = newDirTree
    let dir: DirectoryItem | undefined
    for (const part of parts) {
      dir = _.find(targetDir, (dir) => dir.name === part)
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
    setCurrenyFiles(files)
    setCurrentDirs(dirs)
  }

  const openUpperDirectory = async () => {
    const upperPath = activePath.split('/').slice(0, -1).join("/")
    await openDirectory(upperPath)
  }

  const openDirectoryByPathPartIndex = async (pathPartIndex: number) => {
    const path = activePath.split("/").slice(0, pathPartIndex).join("/")
    console.debug("goToDirectoryByIndex", pathPartIndex, `'${path}'`)
    return await openDirectory(path)
  }

  const openFile = (filename: string) => {
    const filepath = `${activePath}/${filename}`
    console.debug("REQUESTING FILE", filepath)
  }

  useEffect(() => {
    return void load()
  }, [])

  return <StyledFileBrowserBlock onWheel={(event) => event.stopPropagation()}>
    <StyledBlockContent>
      <FileBrowserTopbar activePath={activePath}
                         onSelectPathPart={openDirectoryByPathPartIndex} />
      activePath={activePath}
      <StyledMain>
        <FileBrowserDirectories
          dirs={directoryTree}
          activePath={activePath}
          onOpenDirectory={openDirectory} />
        <FileBrowserDirectoryContent
          dirs={currentDirs}
          files={currentFiles}
          onOpenFile={openFile}
          onOpenUpperDirectory={openUpperDirectory}
          onOpenDirectory={openDirectory}/>
      </StyledMain>
    </StyledBlockContent>
  </StyledFileBrowserBlock>
}

export default FileBrowserBlock
