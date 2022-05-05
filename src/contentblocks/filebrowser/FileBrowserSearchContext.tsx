import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react"
import {
  BrowserContents,
  BrowserDirectory,
  BrowserFile,
} from "../../veedrive/common/models"
import { delay } from "../../common/asynchronous"
import _ from "lodash"
import VeeDriveConfig from "../../veedrive/config"
import { VeeDriveSearchFileSystemRequest } from "../../veedrive/types"
import VeeDriveService from "../../veedrive/service"
import { useSpectacle } from "../../core/spectacle/SpectacleContext"

const SEARCH_QUERY_CHANGE_DEBOUNCE_MS = 500
const SEARCH_RESULTS_FETCH_INTERVAL_MS = 1000

interface FileBrowserSearchContextProps {
  searchMode: boolean
  shouldDisplaySearchResults: boolean
  searchQuery: string
  setSearchMode(enabled: boolean): void
  requestSearch(query: string): void
  isSearchingInProgress: boolean
  searchResults: BrowserContents
}

async function* newFilesystemSearch(
  query: string,
  fileService: VeeDriveService
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

export const FileBrowserSearchContextProvider: React.FC = ({ children }) => {
  const { veeDriveService } = useSpectacle()
  const [searchMode, setSearchMode] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<BrowserContents>({
    files: [],
    directories: [],
  })
  const [isSearchingInProgress, setIsSearchingInProgress] = useState<boolean>(
    false
  )

  const triggerSearchQueryChange = useCallback(
    async (newQuery, stopper) => {
      setSearchResults({
        files: [],
        directories: [],
      })
      setIsSearchingInProgress(true)
      console.debug(`Starting new search for "${newQuery}"`)
      for await (const result of newFilesystemSearch(
        newQuery,
        veeDriveService
      )) {
        if (stopper.stopped) {
          break
        }
        const { files, directories } = result
        setSearchResults({ files, directories })
        await delay(SEARCH_RESULTS_FETCH_INTERVAL_MS)
      }
      setIsSearchingInProgress(false)
      console.debug("Finished searching process")
    },
    [veeDriveService]
  )

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
        console.debug("Stop fetching results")
        this.stopped = true
      },
    }
    if (searchQuery.length >= VeeDriveConfig.minSearchQueryLength) {
      debouncedSearchQueryChange(searchQuery, stopper)
    } else {
      setSearchResults({ files: [], directories: [] })
    }
    return () => {
      stopper.stop()
    }
  }, [debouncedSearchQueryChange, searchQuery, triggerSearchQueryChange])

  const shouldDisplaySearchResults =
    searchMode && searchQuery.length >= VeeDriveConfig.minSearchQueryLength

  const requestSearch = async (query: string) => {
    setSearchQuery(query)
  }

  const providerValue: FileBrowserSearchContextProps = useMemo(
    () => ({
      searchMode,
      searchQuery,
      searchResults,
      shouldDisplaySearchResults,
      isSearchingInProgress,
      setSearchMode,
      requestSearch,
    }),
    [
      isSearchingInProgress,
      searchMode,
      searchQuery,
      searchResults,
      shouldDisplaySearchResults,
    ]
  )

  return (
    <FileBrowserSearchContext.Provider value={providerValue}>
      {children}
    </FileBrowserSearchContext.Provider>
  )
}

const FileBrowserSearchContext = createContext<FileBrowserSearchContextProps>(
  null
)

export const useFileBrowserSearch = () => useContext(FileBrowserSearchContext)
