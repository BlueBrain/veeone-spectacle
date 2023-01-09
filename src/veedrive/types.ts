import { SpectaclePresentation } from "../types"

export interface VeeDriveListDirectoryRequest {
  path: string
  filters?: string[]
}

export interface VeeDriveListDirectoryResponse {
  directories: VeeDriveSearchResultDirectory[]
  files: VeeDriveFile[]
}

export interface VeeDriveFileRequest {
  path: string
}

export interface VeeDriveFileResponse {
  url: string
  thumbnail: string
  size: number
}

export interface VeeDriveImageRequest extends VeeDriveFileRequest {
  clientSize?: {
    width: number
    height: number
  }
}

export interface VeeDriveImageResponse extends VeeDriveFileResponse {
  scaled?: string
}

export interface VeeDriveSearchFileSystemRequest {
  name: string
}

export interface VeeDriveSearchFileSystemResponse {
  searchId: string
}

export interface SearchFileSystemResponse
  extends VeeDriveListDirectoryResponse {
  done: boolean
}

export interface VeeDriveFile {
  name: string
  size: number
}

export interface VeeDriveDirectory {
  name: string
  path: string
  directories: VeeDriveDirectory[]
  files: VeeDriveFile[]
}

export type VeeDriveSavePresentationRequest = SpectaclePresentation

interface SpectaclePresentationListEntry {
  id: string
  name: string
  createdAt: string
  updatedAt: string
}

export interface VeeDriveListPresentationsResponse {
  count: number
  results: SpectaclePresentationListEntry[]
}

export type VeeDriveListFoldersResponse = string[]

export type VeeDriveCreateFolderResponse = string

export type VeeDriveRemoveFolderResponse = string

export interface VeeDriveSavePresentationResponse {}

export type VeeDriveSearchResultDirectory = string

export interface VeeDriveHealthCheckResponse {
  fs_ok: boolean
  db_ok: boolean
}
