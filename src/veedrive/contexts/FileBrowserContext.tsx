import React from "react"
import { FrameId } from "../../core/presentations/interfaces"
import { FileBrowserViewTypes } from "../common/types"

export interface FileBrowserContextProps {
  frameId?: FrameId

  activePath: string

  historyIndex: number

  history: string[]

  viewType: FileBrowserViewTypes

  isShowingUnsupportedFiles: boolean

  isShowingHiddenFiles: boolean

  toggleShowHiddenFilesFilter(): void

  toggleShowUnsupportedFilesFilter(): void

  navigateUp(): void

  navigateBack(): void

  navigateForward(): void

  navigateToIndex(historyIndex: number): void

  navigateDirectory(dirPath: string): void

  requestFile(fileName: string): void

  changeViewType(newViewType: FileBrowserViewTypes): void

  searchModeOn: boolean
  searchQuery: string
  setSearchMode(enabled: boolean): void
  requestSearch(query: string): void

  nameFilterQuery: string
  filterByName(query: string): void
}

export const FileBrowserContext = React.createContext<FileBrowserContextProps>({
  activePath: "",
  historyIndex: 0,
  history: [""],
  viewType: FileBrowserViewTypes.Thumbnails,
  isShowingHiddenFiles: false,
  isShowingUnsupportedFiles: true,
  toggleShowHiddenFilesFilter: () => {
    throw new Error("Not implemented")
  },
  toggleShowUnsupportedFilesFilter: () => {
    throw new Error("Not implemented")
  },
  navigateUp: () => {
    throw new Error("Not implemented")
  },
  navigateBack: () => {
    throw new Error("Not implemented")
  },
  navigateForward: () => {
    throw new Error("Not implemented")
  },
  navigateToIndex: () => {
    throw new Error("Not implemented")
  },
  navigateDirectory: () => {
    throw new Error("Not implemented")
  },
  requestFile: () => {
    throw new Error("Not implemented")
  },
  changeViewType(newViewType: FileBrowserViewTypes) {
    throw new Error("Not implemented")
  },
  searchModeOn: false,
  searchQuery: "",
  setSearchMode(enabled: boolean) {
    throw new Error("Not implemented")
  },
  requestSearch(query: string) {
    throw new Error("Not implemented")
  },
  nameFilterQuery: "",
  filterByName(query: string) {
    throw new Error("Not implemented")
  },
})
