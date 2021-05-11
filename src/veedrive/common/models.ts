import { DirectoryItem, FileItem } from "../types"

export class BrowserFile implements FileItem {
  name: string
  size: number
  dir: string

  constructor({ name, size, dir }) {
    this.name = name
    this.size = size
    this.dir = dir
  }

  public get fullpath(): string {
    return `${this.dir}/${this.name}`
  }
}

export class BrowserDirectory implements DirectoryItem {
  public name: string
  public directories: BrowserDirectory[]
  public files: BrowserFile[]

  constructor(public path: string) {
    this.name = path.split("/").pop() as string
  }
}
