import styled from "styled-components"
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react"
import FileBrowserDirectoryContent from "./FileBrowserDirectoryContent"
import fileService from "../../veedrive/service"
import { VeeDriveSearchFileSystemRequest } from "../../veedrive/types"
import FileBrowserTopbar from "./FileBrowserTopbar"
import _ from "lodash"
import {
  BrowserContents,
  BrowserDirectory,
  BrowserFile,
} from "../../veedrive/common/models"
import { ContentBlockProps } from "../types"
import { useDispatch, useSelector } from "react-redux"
import { updateFrameData } from "../../core/redux/actions"
import { FrameEntry, SceneStateData } from "../../core/scenes/interfaces"
import { getFrame } from "../../core/redux/selectors"
import {
  FileBrowserContext,
  FileBrowserContextProps,
} from "./FileBrowserContext"
import { FileBrowserBlockPayload, FileBrowserViewTypes } from "./types"
import VeeDriveConfig from "../../veedrive/config"
import FileBrowserFooter from "./FileBrowserFooter"
import { FrameContext } from "../../core/frames"
import { fileOpenerService } from "../../file-opener"
import FileSystemBusyIndicator from "./FileSystemBusyIndicator"
import { delay } from "../../common/asynchronous"
import FileBrowserBackgroundProgressIndicator from "./FileBrowserBackgroundProgressIndicator"

const SEARCH_QUERY_CHANGE_DEBOUNCE_MS = 1000

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

async function* newFilesystemSearch(
  query: string
): AsyncIterableIterator<BrowserContents> {
  const payload: VeeDriveSearchFileSystemRequest = {
    name: query,
  }
  for await (const { files, directories } of fileService.searchFileSystem(
    payload
  )) {
    yield {
      files: files.map(file => new BrowserFile(file.name, file.size)),
      directories: directories.map(dirPath => new BrowserDirectory(dirPath)),
    }
  }
}

const FileBrowserBlock: React.FC<ContentBlockProps> = ({ frameId }) => {
  const dispatch = useDispatch()

  const frameData = (useSelector<SceneStateData>(state =>
    getFrame(state, frameId)
  ) as unknown) as FrameEntry

  const situation = frameData.situation
  const blockData = (frameData.data as unknown) as FileBrowserBlockPayload
  const history = useMemo(() => blockData?.history ?? [""], [
    blockData?.history,
  ])
  const historyIndex = useMemo(() => blockData?.historyIndex ?? 0, [
    blockData?.historyIndex,
  ])
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
  const [isSearchingInProgress, setIsSearchingInProgress] = useState<boolean>(
    false
  )
  const [pathLoaded, setPathLoaded] = useState<string | null>(null)
  const [activePathFiles, setActivePathFiles] = useState([] as BrowserFile[])
  const [activePathDirs, setActivePathDirs] = useState([] as BrowserDirectory[])

  const initializeTree = useCallback(async () => {
    console.debug("initializeTree", activePath)
    setPathLoaded(null)
    const tree = await fetchDirectoryContents(activePath)
    setPathLoaded(activePath)
    let currentDirList = tree.dirs
    let files = tree.files
    setActivePathDirs(currentDirList)
    setActivePathFiles(files)
  }, [activePath])

  useEffect(() => {
    void initializeTree()
  }, [initializeTree, activePath])

  const addToBrowsingHistory = useCallback(
    dirPath => {
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
    },
    [dispatch, frameId, history, historyIndex]
  )

  const openParentDirectory = useCallback(async () => {
    const upperPath = activePath.split("/").slice(0, -1).join("/")
    addToBrowsingHistory(upperPath)
  }, [activePath, addToBrowsingHistory])

  const openDirectoryByPathPartIndex = async (pathPartIndex: number) => {
    const path = activePath.split("/").slice(0, pathPartIndex).join("/")
    return addToBrowsingHistory(path)
  }

  const setBrowsingHistoryIndex = useCallback(
    async (newIndex: number) => {
      let newHistoryIndex = newIndex
      if (newHistoryIndex + 1 >= history.length) {
        newHistoryIndex = history.length - 1
      }
      const newFrameData: FileBrowserBlockPayload = {
        history: history,
        historyIndex: newHistoryIndex,
      }
      dispatch(updateFrameData(frameId, newFrameData))
    },
    [dispatch, frameId, history]
  )

  const moveBrowsingHistoryIndex = useCallback(
    async (delta: number) => {
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
    },
    [dispatch, frameId, history, historyIndex]
  )

  const changeViewType = useCallback(
    async (newType: FileBrowserViewTypes) => {
      const newFrameData = {
        viewType: newType,
      }
      dispatch(updateFrameData(frameId, newFrameData))
    },
    [dispatch, frameId]
  )

  const openPreviousDirectory = useCallback(async () => {
    await moveBrowsingHistoryIndex(1)
  }, [moveBrowsingHistoryIndex])

  const openNextDirectory = useCallback(async () => {
    await moveBrowsingHistoryIndex(-1)
  }, [moveBrowsingHistoryIndex])

  const openFile = useCallback(
    async (filePath: string) => {
      console.debug(`Requesting ${filePath} from frame=${frameId}`)
      await fileOpenerService.handleFile(filePath, {
        left: situation.left + situation.width / 2,
        top: situation.top + situation.height / 2,
      })
    },
    [frameId, situation.height, situation.left, situation.top, situation.width]
  )

  const triggerSearchQueryChange = useCallback(async (newQuery, stopper) => {
    setSearchResults({
      files: [],
      directories: [],
    })
    setIsSearchingInProgress(true)
    console.debug(`Starting new search for "${newQuery}"`)
    for await (const result of newFilesystemSearch(newQuery)) {
      if (stopper.stopped) {
        break
      }
      const { files, directories } = result
      setSearchResults({ files, directories })
      await delay(1000)
    }
    setIsSearchingInProgress(false)
    console.debug("Finished searching process")
  }, [])

  const debouncedSearchQueryChange = useMemo(
    () =>
      _.debounce(
        (newQuery: string, stopper) =>
          triggerSearchQueryChange(newQuery, stopper),
        SEARCH_QUERY_CHANGE_DEBOUNCE_MS
      ),
    [triggerSearchQueryChange]
  )

  useEffect(() => {
    const stopper = {
      stopped: false,
      stop: function () {
        console.debug("STOPPING STOPPER :))")
        this.stopped = true
      },
    }
    if (searchQuery.length >= VeeDriveConfig.minSearchQueryLength) {
      debouncedSearchQueryChange(searchQuery, stopper)
      return () => {
        stopper.stop()
      }
    }
  }, [debouncedSearchQueryChange, searchQuery, triggerSearchQueryChange])

  const shouldDisplaySearchResults =
    searchMode && searchQuery.length >= VeeDriveConfig.minSearchQueryLength

  const hiddenFileOrDirectoryFilter: FilterFunction = useCallback(
    element => isShowingHiddenFiles || !element.name.startsWith("."),
    [isShowingHiddenFiles]
  )

  const supportedContentFilter: FilterFunction = useCallback(
    element =>
      isShowingUnsupportedFiles ||
      fileOpenerService.doesSupportFileExtension(element.name.split(".").pop()),
    [isShowingUnsupportedFiles]
  )

  const nameFilter: FilterFunction = useCallback(
    element =>
      element.name.toLowerCase().includes(nameFilterQuery.toLowerCase()),
    [nameFilterQuery]
  )

  const combinedFileFilter: FilterFunction = useCallback(
    element =>
      hiddenFileOrDirectoryFilter(element) &&
      supportedContentFilter(element) &&
      nameFilter(element),
    [hiddenFileOrDirectoryFilter, supportedContentFilter, nameFilter]
  )

  const combinedDirFilter: FilterFunction = useCallback(
    element => hiddenFileOrDirectoryFilter(element) && nameFilter(element),
    [hiddenFileOrDirectoryFilter, nameFilter]
  )

  const filteredFiles = useMemo(
    () =>
      (shouldDisplaySearchResults
        ? searchResults.files
        : activePathFiles
      ).filter(combinedFileFilter),
    [
      shouldDisplaySearchResults,
      activePathFiles,
      searchResults.files,
      combinedFileFilter,
    ]
  )

  const filteredDirs = useMemo(
    () =>
      (shouldDisplaySearchResults
        ? searchResults.directories
        : activePathDirs
      ).filter(combinedDirFilter),
    [
      shouldDisplaySearchResults,
      activePathDirs,
      combinedDirFilter,
      searchResults.directories,
    ]
  )

  const totalFilesCount = useMemo<number>(
    () =>
      shouldDisplaySearchResults
        ? searchResults.files.length
        : activePathFiles.length,
    [activePathFiles, searchResults.files, shouldDisplaySearchResults]
  )
  const hiddenFilesCount = useMemo(
    () => totalFilesCount - filteredFiles.length,
    [filteredFiles.length, totalFilesCount]
  )

  const isLoading = !searchMode && activePath !== pathLoaded

  const fileBrowserContextProvider: FileBrowserContextProps = useMemo(
    () => ({
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
      isSearchingInProgress,
    }),
    [
      activePath,
      addToBrowsingHistory,
      changeViewType,
      dispatch,
      frameId,
      hiddenFilesCount,
      history,
      historyIndex,
      isShowingHiddenFiles,
      isShowingUnsupportedFiles,
      nameFilterQuery,
      openFile,
      openNextDirectory,
      openParentDirectory,
      openPreviousDirectory,
      searchMode,
      searchQuery,
      setBrowsingHistoryIndex,
      totalFilesCount,
      viewType,
      isSearchingInProgress,
    ]
  )

  const frameContext = useContext(FrameContext)
  useEffect(() => {
    frameContext.preventMoving()
    frameContext.preventResizing()
    frameContext.preventFullscreen()
  }, [frameContext])

  return (
    <FileBrowserContext.Provider value={fileBrowserContextProvider}>
      <StyledFileBrowserBlock onWheel={event => event.stopPropagation()}>
        <StyledBlockContent>
          <FileBrowserTopbar onSelectPathPart={openDirectoryByPathPartIndex} />
          <StyledMain>
            {!isLoading ? (
              <FileBrowserDirectoryContent
                dirs={filteredDirs}
                files={filteredFiles}
              />
            ) : (
              <FileSystemBusyIndicator />
            )}
          </StyledMain>
          {!isLoading ? <FileBrowserFooter /> : null}
          <FileBrowserBackgroundProgressIndicator />
        </StyledBlockContent>
      </StyledFileBrowserBlock>
    </FileBrowserContext.Provider>
  )
}

export default FileBrowserBlock