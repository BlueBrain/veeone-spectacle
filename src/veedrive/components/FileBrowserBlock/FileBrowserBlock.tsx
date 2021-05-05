import styled from "styled-components"
import React, { useEffect, useState } from "react"
import FileBrowserDirectories from "./FileBrowserDirectories"
import FileBrowserFileList from "./FileBrowserFileList"
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
  const [dirs, setDirs] = useState([] as DirectoryItem[])
  const [files, setFiles] = useState([] as VeeDriveListDirectoryFile[])
  const [activePath, setActivePath] = useState("")

  const load = async () => {
    const response = await fileService.listDirectory({ path: activePath })
    const dirs = response.directories.map((path) => new BrowserDirectory(path))
    setDirs(_.sortBy(dirs, "name"))
    setFiles(response.files)
  }

  const listDirectory = async (dirPath) => {
    setActivePath(dirPath)
    const response = await fileService.listDirectory({ path: dirPath })
    const newDirs = response.directories.map((path) => new BrowserDirectory(`${dirPath}/${path}`))
    const newDirTree = [...dirs]
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
      if(dir.directories === undefined || dir.directories.length === 0) {
        dir.directories = newDirs
      } else {
        dir.directories = []
      }

      setDirs(newDirTree)
      setFiles(response.files)
    }
  }

  const goToDirectoryByIndex = async (pathPartIndex: number) => {
    const path = activePath.split("/").slice(0, pathPartIndex).join("/")
    console.debug("goToDirectoryByIndex", pathPartIndex, path)
    return await listDirectory(path)
  }

  useEffect(() => {
    return void load()
  }, [])

  return <StyledFileBrowserBlock onWheel={(event) => event.stopPropagation()}>
    <StyledBlockContent>
      <FileBrowserTopbar activePath={activePath}
                         onSelectPathPart={goToDirectoryByIndex} />

      <StyledMain>
        <FileBrowserDirectories dirs={dirs} onOpenDirectory={listDirectory} />
        <FileBrowserFileList dirs={dirs} files={files} />
      </StyledMain>
    </StyledBlockContent>
  </StyledFileBrowserBlock>
}

export default FileBrowserBlock
