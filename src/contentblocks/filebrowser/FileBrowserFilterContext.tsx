import React, { createContext, useCallback, useContext, useMemo } from "react"
import { fileOpenerService } from "../../file-opener"
import { BrowserDirectory, BrowserFile } from "../../veedrive/common/models"
import { FileBrowserBlockPayload } from "./types"
import { FrameId } from "../../types"
import { useFileBrowserSearch } from "./FileBrowserSearchContext"
import { useFileBrowser } from "./FileBrowserContext"
import { useSpectacle } from "../../spectacle/SpectacleStateContext"
import { useDesk } from "../../desk/DeskContext"

interface FileBrowserFilterContextProps {
  filteredFiles: BrowserFile[]
  filteredDirs: BrowserDirectory[]
  filterByName(query: string): void
  nameFilterQuery: string
  isShowingUnsupportedFiles: boolean
  isShowingHiddenFiles: boolean
  toggleShowHiddenFilesFilter(): void
  toggleShowUnsupportedFilesFilter(): void
  resetFilters(): void
  displayAllHiddenFiles(): void
}

interface FileBrowserFilterContextProviderProps {
  frameId: FrameId
}

type FilterableElement = BrowserFile | BrowserDirectory

type FilterFunction = (element: FilterableElement) => boolean

export const FileBrowserFilterContext = createContext<FileBrowserFilterContextProps>(
  null
)

export const FileBrowserFilterContextProvider: React.FC<FileBrowserFilterContextProviderProps> = ({
  frameId,
  children,
}) => {
  const { searchResults, shouldDisplaySearchResults } = useFileBrowserSearch()
  const { activePathFiles, activePathDirs } = useFileBrowser()
  const { getFrame } = useDesk()
  const frameData = useMemo(() => getFrame(frameId), [frameId, getFrame])
  const { updateFrameData } = useSpectacle()

  const blockData = (frameData.data as unknown) as FileBrowserBlockPayload

  const isShowingUnsupportedFiles =
    blockData?.isShowingUnsupportedFiles ?? false
  const isShowingHiddenFiles = blockData?.isShowingHiddenFiles ?? false
  const nameFilterQuery = blockData?.nameFilterQuery ?? ""

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

  const filterByName = useCallback(
    (query: string) => {
      updateFrameData({
        frameId,
        data: {
          nameFilterQuery: query,
        } as FileBrowserBlockPayload,
      })
    },
    [updateFrameData, frameId]
  )

  const resetFilters = useCallback(() => {
    updateFrameData({
      frameId,
      data: {
        nameFilterQuery: "",
        isShowingHiddenFiles: false,
        isShowingUnsupportedFiles: false,
      } as FileBrowserBlockPayload,
    })
  }, [updateFrameData, frameId])

  const toggleShowHiddenFilesFilter = useCallback(() => {
    updateFrameData({
      frameId,
      data: {
        isShowingHiddenFiles: !isShowingHiddenFiles,
      } as FileBrowserBlockPayload,
    })
  }, [updateFrameData, frameId, isShowingHiddenFiles])

  const toggleShowUnsupportedFilesFilter = useCallback(() => {
    updateFrameData({
      frameId,
      data: {
        isShowingUnsupportedFiles: !isShowingUnsupportedFiles,
      } as FileBrowserBlockPayload,
    })
  }, [updateFrameData, frameId, isShowingUnsupportedFiles])

  const displayAllHiddenFiles = useCallback(() => {
    updateFrameData({
      frameId,
      data: {
        isShowingHiddenFiles: true,
        isShowingUnsupportedFiles: true,
      } as FileBrowserBlockPayload,
    })
  }, [updateFrameData, frameId])

  const providerValue: FileBrowserFilterContextProps = useMemo(
    () => ({
      isShowingHiddenFiles,
      isShowingUnsupportedFiles,
      filteredFiles,
      filteredDirs,
      nameFilterQuery,
      filterByName,
      resetFilters,
      toggleShowHiddenFilesFilter,
      toggleShowUnsupportedFilesFilter,
      displayAllHiddenFiles,
    }),
    [
      displayAllHiddenFiles,
      filterByName,
      filteredDirs,
      filteredFiles,
      isShowingHiddenFiles,
      isShowingUnsupportedFiles,
      nameFilterQuery,
      resetFilters,
      toggleShowHiddenFilesFilter,
      toggleShowUnsupportedFilesFilter,
    ]
  )

  return (
    <FileBrowserFilterContext.Provider value={providerValue}>
      {children}
    </FileBrowserFilterContext.Provider>
  )
}

export const useFileBrowserFilter = () => useContext(FileBrowserFilterContext)
