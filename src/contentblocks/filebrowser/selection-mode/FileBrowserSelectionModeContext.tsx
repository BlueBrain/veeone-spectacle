import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react"

interface FileBrowserSelectionModeContextProps {
  isSelectionModeEnabled: boolean
  setIsSelectionModeEnabled(value: boolean): void
  toggleSelectionMode(): boolean
  isFileSelected(filePath: string): boolean
  selectFile(filePath: string): void
  unselectFile(filePath: string): void
  toggleFileSelect(filePath: string): void
  resetSelectedFiles(): void
  selectedFileCount: number
  selectedFiles: string[]
  setSelectedFiles(files: string[]): void
}

type SelectedFilesMap = string[]

export const FileBrowserSelectionModeContextProvider: React.FC = ({
  children,
}) => {
  const [isSelectionModeEnabled, setIsSelectionModeEnabled] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState<SelectedFilesMap>([])

  const isFileSelected = useCallback(
    (filePath: string) => {
      return selectedFiles.includes(filePath)
    },
    [selectedFiles]
  )

  const selectFile = useCallback((filePath: string) => {
    setSelectedFiles(value => {
      if (!value.includes(filePath)) {
        return [...value, filePath]
      }
      return value
    })
  }, [])

  const unselectFile = useCallback((filePath: string) => {
    setSelectedFiles(value => {
      value.splice(value.indexOf(filePath), 1)
      return [...value]
    })
  }, [])

  const toggleFileSelect = useCallback((filePath: string) => {
    setSelectedFiles(oldValue => {
      let newValue
      if (oldValue.includes(filePath)) {
        newValue = [...oldValue]
        newValue.splice(oldValue.indexOf(filePath), 1)
      } else {
        newValue = [...oldValue, filePath]
      }
      return newValue
    })
  }, [])

  const resetSelectedFiles = useCallback(() => {
    setSelectedFiles([])
  }, [])

  const toggleSelectionMode = useCallback(() => {
    const newValue = !isSelectionModeEnabled
    setIsSelectionModeEnabled(newValue)
    if (!newValue) {
      resetSelectedFiles()
    }
    return newValue
  }, [isSelectionModeEnabled, resetSelectedFiles])

  const selectedFileCount = useMemo(() => selectedFiles.length, [selectedFiles])

  const providerValue = useMemo<FileBrowserSelectionModeContextProps>(
    () => ({
      isSelectionModeEnabled,
      setIsSelectionModeEnabled,
      toggleSelectionMode,
      isFileSelected,
      selectFile,
      unselectFile,
      toggleFileSelect,
      resetSelectedFiles,
      selectedFileCount,
      selectedFiles,
      setSelectedFiles,
    }),
    [
      isFileSelected,
      isSelectionModeEnabled,
      selectFile,
      toggleFileSelect,
      toggleSelectionMode,
      unselectFile,
      resetSelectedFiles,
      selectedFileCount,
      selectedFiles,
      setSelectedFiles,
    ]
  )

  return (
    <FileBrowserSelectionModeContext.Provider value={providerValue}>
      {children}
    </FileBrowserSelectionModeContext.Provider>
  )
}

export const FileBrowserSelectionModeContext = createContext<FileBrowserSelectionModeContextProps>(
  null
)

export const useFileBrowserSelectionMode = () =>
  useContext(FileBrowserSelectionModeContext)
