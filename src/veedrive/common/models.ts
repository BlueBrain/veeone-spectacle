import { VeeDriveDirectory, VeeDriveFile } from "../types"

export class BrowserFile implements VeeDriveFile {
  path: string
  size: number
  dir: string

  constructor(path, size) {
    this.path = path
    this.size = size
  }

  public get name(): string {
    return `${this.path.split("/").pop()}`
  }
}

export class BrowserDirectory implements VeeDriveDirectory {
  public name: string
  public directories: BrowserDirectory[]
  public files: BrowserFile[]

  constructor(public path: string) {
    this.name = path.split("/").pop() as string
  }
}

export interface BrowserContents {
  files: BrowserFile[]
  directories: BrowserDirectory[]
}
