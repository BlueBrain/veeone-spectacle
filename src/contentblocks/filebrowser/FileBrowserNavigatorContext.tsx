import React, { useCallback, useContext, useMemo, useState } from "react"
import { FrameId } from "../../types"
import { FileBrowserBlockPayload } from "./types"
import { fileOpenerService } from "../../file-opener"
import { useFileBrowserSearch } from "./FileBrowserSearchContext"
import { useFileBrowserFilter } from "./FileBrowserFilterContext"
import { useFileBrowser } from "./FileBrowserContext"
import { Position, Size } from "../../common/types"
import { useConfig } from "../../config/AppConfigContext"
import { useSpectacle } from "../../spectacle/SpectacleStateContext"
import { useDesk } from "../../desk/DeskContext"

interface FileBrowserNavigatorContextProviderProps {
  frameId: FrameId
}

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

export const FileBrowserNavigatorContextProvider: React.FC<FileBrowserNavigatorContextProviderProps> = ({
  frameId,
  children,
}) => {
  const config = useConfig()
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

  const {
    thumbnailRegistry,
    updateFrameData,
    addFrame,
    bringFrameToFront,
  } = useSpectacle()
  const { filteredFiles } = useFileBrowserFilter()
  const { getFrame } = useDesk()
  const frameData = useMemo(() => getFrame(frameId), [frameId, getFrame])
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
      updateFrameData({ frameId, data: newFrameData })
    },
    [frameId, history, historyIndex, setSearchMode, updateFrameData]
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
      updateFrameData({ frameId, data: newFrameData })
    },
    [frameId, history, updateFrameData]
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
      updateFrameData({ frameId, data: newFrameData })
    },
    [updateFrameData, frameId, history, historyIndex]
  )

  const navigateBack = useCallback(async () => {
    await moveBrowsingHistoryIndex(1)
  }, [moveBrowsingHistoryIndex])

  const navigateForward = useCallback(async () => {
    await moveBrowsingHistoryIndex(-1)
  }, [moveBrowsingHistoryIndex])

  const getNextAvailablePositionForFrame = useCallback(() => {
    const positionToTheRight =
      situation.left +
      situation.width +
      config.DEFAULT_NEW_FRAME_WIDTH / 2 +
      config.FILE_BROWSER_OPEN_MEDIA_OFFSET
    const positionToTheLeft =
      situation.left -
      config.DEFAULT_NEW_FRAME_WIDTH / 2 -
      config.FILE_BROWSER_OPEN_MEDIA_OFFSET
    let left = positionToTheRight
    let top = situation.top + config.DEFAULT_NEW_FRAME_HEIGHT / 2

    if (left + config.DEFAULT_NEW_FRAME_WIDTH / 2 > config.VIEWPORT_WIDTH) {
      // If there's no space on the right, place the frame on the left
      left = positionToTheLeft
    }

    if (left < config.DEFAULT_NEW_FRAME_WIDTH / 2) {
      // If there's no space on the left, place the frame in the middle of the desk
      left = config.VIEWPORT_WIDTH / 2
      if (
        top - config.FILE_BROWSER_OPEN_MEDIA_OFFSET >
        config.DEFAULT_NEW_FRAME_HEIGHT / 2
      ) {
        top -= config.FILE_BROWSER_OPEN_MEDIA_OFFSET
      }
    }

    return { left, top }
  }, [
    config.DEFAULT_NEW_FRAME_HEIGHT,
    config.DEFAULT_NEW_FRAME_WIDTH,
    config.FILE_BROWSER_OPEN_MEDIA_OFFSET,
    config.VIEWPORT_WIDTH,
    situation.left,
    situation.top,
    situation.width,
  ])

  const requestFile = useCallback(
    async (filePath: string, referencePosition?: Position) => {
      function adjustThumbnailToFrameSize(thumbnailSize: Size) {
        const aspectRatio = thumbnailSize.width / thumbnailSize.height
        let newSize = { ...thumbnailSize }
        if (
          newSize.width > newSize.height &&
          newSize.width < config.DEFAULT_NEW_FRAME_WIDTH
        ) {
          newSize.width = config.DEFAULT_NEW_FRAME_WIDTH
          newSize.height = newSize.width / aspectRatio
        } else if (
          newSize.height > newSize.width &&
          newSize.height < config.DEFAULT_NEW_FRAME_HEIGHT
        ) {
          newSize.height = config.DEFAULT_NEW_FRAME_HEIGHT
          newSize.width = newSize.height * aspectRatio
        }
        return newSize
      }

      function getInitialFrameSize(path) {
        return path in thumbnailRegistry
          ? adjustThumbnailToFrameSize(thumbnailRegistry[path].size)
          : {
              width: config.DEFAULT_NEW_FRAME_WIDTH,
              height: config.DEFAULT_NEW_FRAME_HEIGHT,
            }
      }

      await fileOpenerService.handleFile(
        filePath,
        referencePosition ?? getNextAvailablePositionForFrame(),
        getInitialFrameSize(filePath),
        addFrame,
        bringFrameToFront
      )
    },
    [
      addFrame,
      bringFrameToFront,
      config.DEFAULT_NEW_FRAME_HEIGHT,
      config.DEFAULT_NEW_FRAME_WIDTH,
      frameId,
      getNextAvailablePositionForFrame,
      thumbnailRegistry,
    ]
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
          left:
            initialPosition.left +
            (frameCounter %
              config.FILE_BROWSER_OPEN_MEDIA_CASCADE_MAX_PER_ROW) *
              offsetX,
          top: initialPosition.top + offsetY * frameCounter,
        }
        let timeout = (p, fc) =>
          setTimeout(async () => {
            await requestFile(filePath, p)
          }, config.FILE_BROWSER_OPEN_MEDIA_CASCADE_DELAY_MS * fc)
        timeout(position, frameCounter)
        frameCounter++
      }
    },
    [
      config.FILE_BROWSER_OPEN_MEDIA_CASCADE_DELAY_MS,
      config.FILE_BROWSER_OPEN_MEDIA_CASCADE_MAX_PER_ROW,
      config.FILE_BROWSER_OPEN_MEDIA_CASCADE_OFFSET_X,
      config.FILE_BROWSER_OPEN_MEDIA_CASCADE_OFFSET_Y,
      getNextAvailablePositionForFrame,
      requestFile,
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
