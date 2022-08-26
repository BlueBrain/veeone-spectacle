import {
  SearchFileSystemResponse,
  VeeDriveCreateFolderResponse,
  VeeDriveFileRequest,
  VeeDriveFileResponse,
  VeeDriveImageRequest,
  VeeDriveImageResponse,
  VeeDriveListDirectoryRequest,
  VeeDriveListDirectoryResponse,
  VeeDriveListFoldersResponse,
  VeeDriveListPresentationsResponse,
  VeeDriveRemoveFolderResponse,
  VeeDriveSavePresentationRequest,
  VeeDriveSavePresentationResponse,
  VeeDriveSearchFileSystemRequest,
  VeeDriveSearchFileSystemResponse,
} from "./types"
import WebsocketAdapter from "./adapters"
import { SpectaclePresentation } from "../types"
import CommunicationAdapterBase from "./adapters/base"

class VeeDriveService {
  protected readonly communicationAdapter: CommunicationAdapterBase
  private readonly endpointNames = {
    listDirectory: "ListDirectory",
    requestFile: "RequestFile",
    requestImage: "RequestImage",
    searchFiles: "Search",
    searchResults: "SearchResult",
    savePresentation: "SavePresentation",
    listPresentations: "ListPresentations",
    getPresentation: "GetPresentation",
    listFolders: "ListFolders",
    createFolder: "CreateFolder",
    removeFolder: "RemoveFolder",
  }

  constructor(private wsPath: string) {
    this.communicationAdapter = new WebsocketAdapter(this.wsPath)
  }

  protected readonly sendRequest = async (method: string, params?: any) =>
    this.communicationAdapter.sendRequest(method, params)

  public readonly connect = async () => this.communicationAdapter.connect()

  public readonly isConnected = () => this.communicationAdapter.isConnected()

  public readonly listDirectory = async (
    params: VeeDriveListDirectoryRequest
  ): Promise<VeeDriveListDirectoryResponse> =>
    this.sendRequest(this.endpointNames.listDirectory, params)

  public readonly requestFile = async (
    params: VeeDriveFileRequest
  ): Promise<VeeDriveFileResponse> =>
    this.sendRequest(this.endpointNames.requestFile, params)

  public readonly requestImage = async (
    params: VeeDriveImageRequest
  ): Promise<VeeDriveImageResponse> =>
    this.sendRequest(this.endpointNames.requestImage, params)

  public async *searchFileSystem(
    params: VeeDriveSearchFileSystemRequest
  ): AsyncIterableIterator<SearchFileSystemResponse> {
    console.debug("Send search request", params)
    const searchResponse: VeeDriveSearchFileSystemResponse = await this.sendRequest(
      this.endpointNames.searchFiles,
      params
    )
    const searchId = searchResponse.searchId
    console.debug("Got searchId", searchId)
    while (true) {
      console.debug("Fetch results for", searchId)
      const currentResults: SearchFileSystemResponse = await this.sendRequest(
        this.endpointNames.searchResults,
        { searchId }
      )
      if (typeof currentResults === "undefined") {
        console.warn("currentResults was undefined", searchId)
        return
      }
      yield currentResults
    }
  }

  public readonly savePresentation = async (
    store: VeeDriveSavePresentationRequest
  ): Promise<VeeDriveSavePresentationResponse> =>
    this.sendRequest(this.endpointNames.savePresentation, store)

  public readonly listPresentations = async (): Promise<VeeDriveListPresentationsResponse> =>
    this.sendRequest(this.endpointNames.listPresentations)

  public readonly getPresentation = async (
    id: string
  ): Promise<SpectaclePresentation> =>
    this.sendRequest(this.endpointNames.getPresentation, { id })

  public readonly listFolders = async (): Promise<VeeDriveListFoldersResponse> =>
    this.sendRequest(this.endpointNames.listFolders)

  public readonly createFolder = async (): Promise<VeeDriveCreateFolderResponse> =>
    this.sendRequest(this.endpointNames.createFolder)

  public readonly removeFolder = async (): Promise<VeeDriveRemoveFolderResponse> =>
    this.sendRequest(this.endpointNames.removeFolder)
}

export default VeeDriveService
