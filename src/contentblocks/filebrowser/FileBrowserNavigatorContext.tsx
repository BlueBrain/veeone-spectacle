import React, { useCallback, useContext, useMemo, useState } from "react"
import { FrameEntry, FrameId, SpectaclePresentation } from "../../core/types"
import { FileBrowserBlockPayload } from "./types"
import { updateFrameData } from "../../core/redux/actions"
import { useDispatch, useSelector } from "react-redux"
import { fileOpenerService } from "../../file-opener"
import { getFrame } from "../../core/redux/selectors"
import { useFileBrowserSearch } from "./FileBrowserSearchContext"
import { useFileBrowserFilter } from "./FileBrowserFilterContext"
import { useFileBrowser } from "./FileBrowserContext"
import { config } from "../../config"
import { Position } from "../../common/types"

export interface FileBrowserNavigatorContextProps {
  navigateUp(): void
  navigateBack(): void
  navigateForward(): void
  navigateToIndex(historyIndex: number): void
  navigateDirectory(dirPath: string): void
  requestFile(filePath: string): void
  requestMultipleFiles(filePaths: string[]): void
  hiddenFilesCount: number
  totalFilesCount: number
  scrollableAreaRef: HTMLElement
  setScrollableAreaRef(HTMLElement): void
  openDirectoryByPathPartIndex(pathPartIndex: number): void
  isLoading: boolean
}

interface FileBrowserNavigatorContextProviderProps {
  frameId: FrameId
}

export const FileBrowserNavigatorContextProvider: React.FC<FileBrowserNavigatorContextProviderProps> = ({
  frameId,
  children,
}) => {
  const {
    activePath,
    pathLoaded,
    historyIndex,
    history,
    activePathFiles,
  } = useFileBrowser()
  const {
    setSearchMode,
    searchMode,
    shouldDisplaySearchResults,
    searchResults,
  } = useFileBrowserSearch()

  const { filteredFiles } = useFileBrowserFilter()

  const dispatch = useDispatch()

  const frameData = (useSelector<SpectaclePresentation>(state =>
    getFrame(state, frameId)
  ) as unknown) as FrameEntry

  const situation = frameData.situation

  const navigateDirectory = useCallback(
    dirPath => {
      setSearchMode(false)
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
    [dispatch, frameId, history, historyIndex, setSearchMode]
  )

  const navigateUp = useCallback(async () => {
    const upperPath = activePath.split("/").slice(0, -1).join("/")
    navigateDirectory(upperPath)
  }, [activePath, navigateDirectory])

  const openDirectoryByPathPartIndex = useMemo(
    () => async (pathPartIndex: number) => {
      const path = activePath.split("/").slice(0, pathPartIndex).join("/")
      return navigateDirectory(path)
    },
    [activePath, navigateDirectory]
  )

  const navigateToIndex = useCallback(
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

  const navigateBack = useCallback(async () => {
    await moveBrowsingHistoryIndex(1)
  }, [moveBrowsingHistoryIndex])

  const navigateForward = useCallback(async () => {
    await moveBrowsingHistoryIndex(-1)
  }, [moveBrowsingHistoryIndex])

  const getNextAvailablePositionForFrame = useCallback(() => {
    return {
      left:
        situation.left +
        situation.width +
        config.DEFAULT_NEW_FRAME_WIDTH / 2 +
        config.FILE_BROWSER_OPEN_MEDIA_OFFSET,
      top: situation.top + config.DEFAULT_NEW_FRAME_HEIGHT / 2,
    }
  }, [situation])

  const requestFile = useCallback(
    async (filePath: string, referencePosition?: Position) => {
      console.debug(`Requesting ${filePath} from frame=${frameId}`)
      await fileOpenerService.handleFile(
        filePath,
        referencePosition ?? getNextAvailablePositionForFrame()
      )
    },
    [frameId, getNextAvailablePositionForFrame]
  )

  const requestMultipleFiles = useCallback(
    async (filePaths: string[]) => {
      const initialPosition: Position = getNextAvailablePositionForFrame()
      let position
      let frameCounter = 0
      const offsetX = config.FILE_BROWSER_OPEN_MEDIA_CASCADE_OFFSET_X
      const offsetY = config.FILE_BROWSER_OPEN_MEDIA_CASCADE_OFFSET_Y
      for (const filePath of filePaths) {
        position = {
          left: initialPosition.left + offsetX * frameCounter,
          top: initialPosition.top + offsetY * frameCounter,
        }
        await requestFile(filePath, position)
        frameCounter++
      }
    },
    [getNextAvailablePositionForFrame, requestFile]
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

  const [scrollableAreaRef, setScrollableAreaRef] = useState(null)

  const providerValue: FileBrowserNavigatorContextProps = useMemo(
    () => ({
      navigateUp,
      navigateBack,
      navigateForward,
      navigateToIndex,
      navigateDirectory,
      openDirectoryByPathPartIndex,
      requestFile,
      requestMultipleFiles,
      totalFilesCount,
      hiddenFilesCount,
      scrollableAreaRef,
      setScrollableAreaRef,
      isLoading,
    }),
    [
      openDirectoryByPathPartIndex,
      totalFilesCount,
      hiddenFilesCount,
      scrollableAreaRef,
      isLoading,
      navigateUp,
      navigateBack,
      navigateForward,
      navigateToIndex,
      navigateDirectory,
      requestFile,
      requestMultipleFiles,
    ]
  )

  return (
    <FileBrowserNavigatorContext.Provider value={providerValue}>
      {children}
    </FileBrowserNavigatorContext.Provider>
  )
}

export const FileBrowserNavigatorContext = React.createContext<FileBrowserNavigatorContextProps>(
  null
)

export const useFileBrowserNavigator = () =>
  useContext(FileBrowserNavigatorContext)
