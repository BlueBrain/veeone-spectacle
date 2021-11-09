import styled from "styled-components"
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react"
import FileBrowserDirectoryContent from "./FileBrowserDirectoryContent"
import fileService from "../../service"
import { VeeDriveSearchFileSystemRequest } from "../../types"
import FileBrowserTopbar from "./FileBrowserTopbar"
import _ from "lodash"
import {
  BrowserContents,
  BrowserDirectory,
  BrowserFile,
} from "../../common/models"
import {
  ContentBlockProps,
  ContentBlockTypes,
} from "../../../contentblocks/types"
import { useDispatch, useSelector } from "react-redux"
import { addFrame, updateFrameData } from "../../../core/redux/actions"
import { generateFrameId } from "../../../core/frames/utils"
import { FrameEntry, SceneStateData } from "../../../core/scenes/interfaces"
import { getFrame } from "../../../core/redux/selectors"
import {
  FileBrowserContext,
  FileBrowserContextProps,
} from "../../contexts/FileBrowserContext"
import {
  FileBrowserBlockPayload,
  FileBrowserViewTypes,
} from "../../common/types"
import VeeDriveConfig from "../../config"
import FileBrowserFooter from "./FileBrowserFooter"
import { FrameContext } from "../../../core/frames"
import { fileOpenerService } from "../../../file-opener"

type FilterableElement = BrowserFile | BrowserDirectory

type FilterFunction = (element: FilterableElement) => boolean

const StyledFileBrowserBlock = styled.div`
  background: #fafafa;
  width: 100%;
  height: 100%;
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.3);
`

const StyledBlockContent = styled.div`
  width: 100%;
  height: calc(100% - 6rem);
`

const StyledMain = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  flex: 1;
`

const fetchDirectoryContents = async dirPath => {
  // todo implement cache for not directly affected/loaded dirs
  const response = await fileService.listDirectory({ path: dirPath })
  const pathPrefix = dirPath !== "" ? `${dirPath}/` : ``
  let dirs: BrowserDirectory[]
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
  const files = response.files.map(
    file => new BrowserFile(`${pathPrefix}${file.name}`, file.size)
  )
  return { dirs, files }
}

const searchFilesystem = async (query: string): Promise<BrowserContents> => {
  const payload: VeeDriveSearchFileSystemRequest = {
    name: query,
  }
  const { files, directories } = await fileService.searchFileSystem(payload)
  return {
    files: files.map(file => new BrowserFile(file.name, file.size)),
    directories: directories.map(dirPath => new BrowserDirectory(dirPath)),
  }
}

const FileBrowserBlock: React.FC<ContentBlockProps> = ({ frameId }) => {
  const dispatch = useDispatch()

  const frameData = (useSelector<SceneStateData>(state =>
    getFrame(state, frameId)
  ) as unknown) as FrameEntry

  const situation = frameData.situation
  const blockData = (frameData.data as unknown) as FileBrowserBlockPayload
  const history = blockData?.history ?? [""]
  const historyIndex = blockData?.historyIndex ?? 0
  const activePath = history[historyIndex]
  const viewType = blockData?.viewType ?? FileBrowserViewTypes.Thumbnails

  // View filters
  const isShowingUnsupportedFiles =
    blockData?.isShowingUnsupportedFiles ?? false
  const isShowingHiddenFiles = blockData?.isShowingHiddenFiles ?? false
  const nameFilterQuery = blockData?.nameFilterQuery ?? ""

  const [searchMode, setSearchMode] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<BrowserContents>({
    files: [],
    directories: [],
  })

  const [globalDirectoryTree, setGlobalDirectoryTree] = useState(
    [] as BrowserDirectory[]
  )
  const [activePathFiles, setActivePathFiles] = useState([] as BrowserFile[])
  const [activePathDirs, setActivePathDirs] = useState([] as BrowserDirectory[])

  const newImageFrame = filePath => {
    console.log("newImageFrame", filePath)
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

  const initializeTree = async () => {
    const paths = activePath.split("/")
    const tree = await fetchDirectoryContents("")
    let path = ""
    let currentDirList = tree.dirs
    let files = tree.files

    for (const p of paths) {
      if (p === "") {
        break
      }

      if (path.length > 0) {
        path += "/"
      }

      path += p

      const dirList = await fetchDirectoryContents(path)
      files = dirList.files
      const target = _.find(currentDirList, dir => dir.name === p)
      if (target !== undefined) {
        target.directories = dirList.dirs
      }
      currentDirList = dirList.dirs
    }
    setGlobalDirectoryTree(tree.dirs)
    setActivePathDirs(currentDirList)
    setActivePathFiles(files)
  }

  useEffect(() => {
    void initializeTree()
  }, [activePath])

  const addToBrowsingHistory = dirPath => {
    const recentPath = history.length > 0 ? history[historyIndex] : ""
    if (dirPath === recentPath) {
      return
    }
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
    addToBrowsingHistory(upperPath)
  }

  const openDirectoryByPathPartIndex = async (pathPartIndex: number) => {
    const path = activePath.split("/").slice(0, pathPartIndex).join("/")
    return addToBrowsingHistory(path)
  }

  const setBrowsingHistoryIndex = async (newIndex: number) => {
    let newHistoryIndex = newIndex
    if (newHistoryIndex + 1 >= history.length) {
      newHistoryIndex = history.length - 1
    }
    const newFrameData: FileBrowserBlockPayload = {
      history: history,
      historyIndex: newHistoryIndex,
    }
    dispatch(updateFrameData(frameId, newFrameData))
  }

  const moveBrowsingHistoryIndex = async (delta: number) => {
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

  const changeViewType = async (newType: FileBrowserViewTypes) => {
    const newFrameData = {
      viewType: newType,
    }
    dispatch(updateFrameData(frameId, newFrameData))
  }

  const openPreviousDirectory = async () => {
    await moveBrowsingHistoryIndex(1)
  }

  const openNextDirectory = async () => {
    await moveBrowsingHistoryIndex(-1)
  }

  const openFile = async (filePath: string) => {
    console.debug(`Requesting ${filePath} from frame=${frameId}`)
    await fileOpenerService.handleFile(filePath, {
      left: situation.left + situation.width / 2,
      top: situation.top + situation.height / 2,
    })
  }

  const performSearch = useCallback(async () => {
    if (searchQuery.length >= VeeDriveConfig.minSearchQueryLength) {
      const { directories, files } = await searchFilesystem(searchQuery)
      setSearchResults({ files, directories })
    }
  }, [searchQuery])

  const onSearchQueryChange = useMemo(() => _.debounce(performSearch, 1000), [
    performSearch,
  ])

  useEffect(() => {
    onSearchQueryChange()
  }, [searchQuery, onSearchQueryChange])

  const shouldDisplaySearchResults =
    searchMode && searchQuery.length >= VeeDriveConfig.minSearchQueryLength

  const hiddenFileOrDirectoryFilter: FilterFunction = element =>
    isShowingHiddenFiles || !element.name.startsWith(".")

  const supportedContentFilter: FilterFunction = element =>
    isShowingUnsupportedFiles ||
    fileOpenerService.doesSupportFileExtension(element.name.split(".").pop())

  const nameFilter: FilterFunction = element =>
    element.name.toLowerCase().includes(nameFilterQuery.toLowerCase())

  const combinedFileFilter: FilterFunction = element =>
    hiddenFileOrDirectoryFilter(element) &&
    supportedContentFilter(element) &&
    nameFilter(element)

  const combinedDirFilter: FilterFunction = element =>
    hiddenFileOrDirectoryFilter(element) && nameFilter(element)

  const filteredFiles = (shouldDisplaySearchResults
    ? searchResults.files
    : activePathFiles
  ).filter(combinedFileFilter)

  const filteredDirs = (shouldDisplaySearchResults
    ? searchResults.directories
    : activePathDirs
  ).filter(combinedDirFilter)

  const totalFilesCount = activePathFiles.length
  const hiddenFilesCount = totalFilesCount - filteredFiles.length

  const fileBrowserContextProvider: FileBrowserContextProps = {
    frameId: frameId,
    activePath: activePath,
    historyIndex: historyIndex,
    history: history,
    viewType: viewType,
    isShowingHiddenFiles: isShowingHiddenFiles,
    isShowingUnsupportedFiles: isShowingUnsupportedFiles,
    navigateUp() {
      void openParentDirectory()
    },
    navigateBack() {
      void openPreviousDirectory()
    },
    navigateForward() {
      void openNextDirectory()
    },
    navigateToIndex(historyIndex: number) {
      void setBrowsingHistoryIndex(historyIndex)
    },
    navigateDirectory(dirPath: string) {
      void addToBrowsingHistory(dirPath)
    },
    requestFile(fileName: string) {
      void openFile(fileName)
    },
    changeViewType(newViewType: FileBrowserViewTypes) {
      void changeViewType(newViewType)
    },
    searchModeOn: searchMode,
    searchQuery: searchQuery,
    setSearchMode(enabled: boolean) {
      setSearchMode(enabled)
    },
    async requestSearch(query: string) {
      setSearchQuery(query)
    },
    toggleShowHiddenFilesFilter: () => {
      dispatch(
        updateFrameData(frameId, {
          isShowingHiddenFiles: !isShowingHiddenFiles,
        } as FileBrowserBlockPayload)
      )
    },
    toggleShowUnsupportedFilesFilter: () => {
      dispatch(
        updateFrameData(frameId, {
          isShowingUnsupportedFiles: !isShowingUnsupportedFiles,
        } as FileBrowserBlockPayload)
      )
    },
    nameFilterQuery: nameFilterQuery,
    filterByName(query: string) {
      dispatch(
        updateFrameData(frameId, {
          nameFilterQuery: query,
        } as FileBrowserBlockPayload)
      )
    },
    resetFilters() {
      dispatch(
        updateFrameData(frameId, {
          nameFilterQuery: "",
          isShowingHiddenFiles: false,
          isShowingUnsupportedFiles: false,
        } as FileBrowserBlockPayload)
      )
    },
    totalFilesCount: totalFilesCount,
    hiddenFilesCount: hiddenFilesCount,
    displayAllHiddenFiles() {
      dispatch(
        updateFrameData(frameId, {
          isShowingHiddenFiles: true,
          isShowingUnsupportedFiles: true,
        } as FileBrowserBlockPayload)
      )
    },
  }

  const frameContext = useContext(FrameContext)
  useEffect(() => {
    frameContext.preventMoving()
    frameContext.preventResizing()
    frameContext.preventFullscreen()
  }, [])

  return (
    <FileBrowserContext.Provider value={fileBrowserContextProvider}>
      <StyledFileBrowserBlock onWheel={event => event.stopPropagation()}>
        <StyledBlockContent>
          <FileBrowserTopbar onSelectPathPart={openDirectoryByPathPartIndex} />
          <StyledMain>
            <FileBrowserDirectoryContent
              dirs={filteredDirs}
              files={filteredFiles}
            />
          </StyledMain>
          <FileBrowserFooter />
        </StyledBlockContent>
      </StyledFileBrowserBlock>
    </FileBrowserContext.Provider>
  )
}

export default FileBrowserBlock
