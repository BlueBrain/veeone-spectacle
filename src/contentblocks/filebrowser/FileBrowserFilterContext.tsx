import React, { createContext, useCallback, useContext, useMemo } from "react"
import { fileOpenerService } from "../../file-opener"
import { BrowserDirectory, BrowserFile } from "../../veedrive/common/models"
import { updateFrameData } from "../../core/redux/actions"
import { FileBrowserBlockPayload } from "./types"
import { useDispatch, useSelector } from "react-redux"
import { FrameEntry, FrameId, SpectaclePresentation } from "../../core/types"
import { getFrame } from "../../core/redux/selectors"
import { useFileBrowserSearch } from "./FileBrowserSearchContext"
import { useFileBrowser } from "./FileBrowserContext"

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
  const dispatch = useDispatch()

  const { searchResults, shouldDisplaySearchResults } = useFileBrowserSearch()
  const { activePathFiles, activePathDirs } = useFileBrowser()

  const frameData = (useSelector<SpectaclePresentation>(state =>
    getFrame(state, frameId)
  ) as unknown) as FrameEntry

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

  const providerValue: FileBrowserFilterContextProps = {
    isShowingHiddenFiles,
    isShowingUnsupportedFiles,
    filteredFiles,
    filteredDirs,
    nameFilterQuery,
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
    displayAllHiddenFiles() {
      dispatch(
        updateFrameData(frameId, {
          isShowingHiddenFiles: true,
          isShowingUnsupportedFiles: true,
        } as FileBrowserBlockPayload)
      )
    },
  }
  return (
    <FileBrowserFilterContext.Provider value={providerValue}>
      {children}
    </FileBrowserFilterContext.Provider>
  )
}

export const useFileBrowserFilter = () => useContext(FileBrowserFilterContext)
