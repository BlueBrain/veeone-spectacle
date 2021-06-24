import { VeeDriveDirectory, VeeDriveFile } from "../types"

export class BrowserFile implements VeeDriveFile {
  name: string
  size: number
  dir: string

  constructor(name, size) {
    this.name = name
    this.size = size
  }

  public get fileName(): string {
    return `${this.name.split("/").pop()}`
  }

  public get fullpath(): string {
    return this.name
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
