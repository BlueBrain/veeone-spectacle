import {
  SearchFileSystemResponse,
  VeeDriveFileRequest,
  VeeDriveFileResponse,
  VeeDriveImageRequest,
  VeeDriveImageResponse,
  VeeDriveListDirectoryRequest,
  VeeDriveListDirectoryResponse,
  VeeDriveSavePresentationRequest,
  VeeDriveSavePresentationResponse,
  VeeDriveSearchFileSystemRequest,
  VeeDriveSearchFileSystemResponse,
} from "./types"
import WebsocketAdapter from "./adapters"
import NetworkFileBrowsingServiceBase from "./base-service"
import VeeDriveConfig from "./config"

class VeeDriveService extends NetworkFileBrowsingServiceBase {
  protected readonly communicationAdapter = new WebsocketAdapter(
    VeeDriveConfig.hostname
  )

  public readonly listDirectory = async (
    params: VeeDriveListDirectoryRequest
  ): Promise<VeeDriveListDirectoryResponse> =>
    this.sendRequest(VeeDriveConfig.endpointNames.listDirectory, params)

  public readonly requestFile = async (
    params: VeeDriveFileRequest
  ): Promise<VeeDriveFileResponse> =>
    this.sendRequest(VeeDriveConfig.endpointNames.requestFile, params)

  public readonly requestImage = async (
    params: VeeDriveImageRequest
  ): Promise<VeeDriveImageResponse> =>
    this.sendRequest(VeeDriveConfig.endpointNames.requestImage, params)

  public async *searchFileSystem(
    params: VeeDriveSearchFileSystemRequest
  ): AsyncIterableIterator<SearchFileSystemResponse> {
    console.debug("Send search request", params)
    const searchResponse: VeeDriveSearchFileSystemResponse = await this.sendRequest(
      VeeDriveConfig.endpointNames.searchFiles,
      params
    )
    const searchId = searchResponse.searchId
    console.debug("Got searchId", searchId)
    while (true) {
      console.debug("Fetch results for", searchId)
      const currentResults: SearchFileSystemResponse = await this.sendRequest(
        VeeDriveConfig.endpointNames.searchResults,
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
    this.sendRequest(VeeDriveConfig.endpointNames.savePresentation, store)
}

export default new VeeDriveService()
