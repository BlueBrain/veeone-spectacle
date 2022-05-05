import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react"
import { FileBrowserSearchContextProvider } from "./FileBrowserSearchContext"
import { FrameId } from "../../core/types"
import { FileBrowserNavigatorContextProvider } from "./FileBrowserNavigatorContext"
import { FileBrowserFilterContextProvider } from "./FileBrowserFilterContext"
import { useDispatch } from "react-redux"
import { FileBrowserBlockPayload, FileBrowserViewTypes } from "./types"
import { BrowserDirectory, BrowserFile } from "../../veedrive/common/models"
import _ from "lodash"
import { updateFrameData } from "../../core/redux/actions"
import { FileBrowserSelectionModeContextProvider } from "./selection-mode/FileBrowserSelectionModeContext"
import { useDesk } from "../../core/desk/DeskContext"
import VeeDriveService from "../../veedrive"
import { useSpectacle } from "../../core/spectacle/SpectacleContext"

interface FileBrowserContextProviderProps {
  frameId: FrameId
}

interface FileBrowserContextProps {
  frameId: FrameId
  activePath: string
  activePathFiles: BrowserFile[]
  activePathDirs: BrowserDirectory[]
  pathLoaded: string | null
  history: string[]
  historyIndex: number
  isShowingUnsupportedFiles: boolean
  isShowingHiddenFiles: boolean
  viewType: FileBrowserViewTypes
  changeViewType(newViewType: FileBrowserViewTypes): void
}

const fetchDirectoryContents = async (
  dirPath,
  veeDriveService: VeeDriveService
) => {
  const response = await veeDriveService.listDirectory({ path: dirPath })
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

export const FileBrowserContextProvider: React.FC<FileBrowserContextProviderProps> = ({
  frameId,
  children,
}) => {
  const { veeDriveService } = useSpectacle()
  const dispatch = useDispatch()
  const { getFrame } = useDesk()
  const frameData = useMemo(() => getFrame(frameId), [frameId, getFrame])
  const blockData = (frameData.data as unknown) as FileBrowserBlockPayload
  const history = useMemo(() => blockData?.history ?? [""], [
    blockData?.history,
  ])
  const historyIndex = useMemo(() => blockData?.historyIndex ?? 0, [
    blockData?.historyIndex,
  ])
  const activePath = history[historyIndex]
  const viewType = blockData?.viewType ?? FileBrowserViewTypes.Thumbnails

  const isShowingUnsupportedFiles =
    blockData?.isShowingUnsupportedFiles ?? false
  const isShowingHiddenFiles = blockData?.isShowingHiddenFiles ?? false

  const [pathLoaded, setPathLoaded] = useState<string | null>(null)
  const [activePathFiles, setActivePathFiles] = useState([] as BrowserFile[])
  const [activePathDirs, setActivePathDirs] = useState([] as BrowserDirectory[])

  const initializeTree = useCallback(async () => {
    console.debug("initializeTree", activePath)
    setPathLoaded(null)
    const tree = await fetchDirectoryContents(activePath, veeDriveService)
    setPathLoaded(activePath)
    let currentDirList = tree.dirs
    let files = tree.files
    setActivePathDirs(currentDirList)
    setActivePathFiles(files)
  }, [activePath, veeDriveService])

  const changeViewType = useCallback(
    async (newType: FileBrowserViewTypes) => {
      const newFrameData = {
        viewType: newType,
      }
      dispatch(updateFrameData(frameId, newFrameData))
    },
    [dispatch, frameId]
  )

  useEffect(() => {
    void initializeTree()
  }, [initializeTree, activePath])

  const providerValue = useMemo(
    () => ({
      frameId,
      activePath,
      activePathFiles,
      activePathDirs,
      history,
      historyIndex,
      isShowingUnsupportedFiles,
      isShowingHiddenFiles,
      viewType,
      changeViewType,
      pathLoaded,
    }),
    [
      activePath,
      activePathDirs,
      activePathFiles,
      changeViewType,
      frameId,
      history,
      historyIndex,
      isShowingHiddenFiles,
      isShowingUnsupportedFiles,
      pathLoaded,
      viewType,
    ]
  )

  return (
    <FileBrowserContext.Provider value={providerValue}>
      <FileBrowserSearchContextProvider>
        <FileBrowserFilterContextProvider frameId={frameId}>
          <FileBrowserNavigatorContextProvider frameId={frameId}>
            <FileBrowserSelectionModeContextProvider>
              {children}
            </FileBrowserSelectionModeContextProvider>
          </FileBrowserNavigatorContextProvider>
        </FileBrowserFilterContextProvider>
      </FileBrowserSearchContextProvider>
    </FileBrowserContext.Provider>
  )
}

export const FileBrowserContext = createContext<FileBrowserContextProps>(null)

export const useFileBrowser = () => useContext(FileBrowserContext)
