export type Json =
  | string
  | number
  | boolean
  | null
  | undefined
  | Json[]
  | { [key: string]: Json }

export interface VeeDriveListDirectoryRequest {
  path: string
  filters?: string[]
}

export interface VeeDriveListDirectoryFile {
  name: string
  size: number
}

export interface VeeDriveListDirectoryResponse {
  directories: string[]
  files: VeeDriveListDirectoryFile[]
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

export interface FileItem {
  name: string
  size: number
}

export interface DirectoryItem {
  name: string
  path: string
  directories: DirectoryItem[]
  files: FileItem[]
}
