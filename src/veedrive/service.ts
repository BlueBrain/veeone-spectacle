import {
  SearchFileSystemResponse,
  VeeDriveFileRequest,
  VeeDriveFileResponse,
  VeeDriveImageRequest,
  VeeDriveImageResponse,
  VeeDriveListDirectoryRequest,
  VeeDriveListDirectoryResponse,
  VeeDriveListPresentationsResponse,
  VeeDriveSavePresentationRequest,
  VeeDriveSavePresentationResponse,
  VeeDriveSearchFileSystemRequest,
  VeeDriveSearchFileSystemResponse,
} from "./types"
import WebsocketAdapter from "./adapters"
import NetworkFileBrowsingServiceBase from "./base-service"
import VeeDriveConfig from "./config"
import { SpectaclePresentation } from "../core/types"
import { ApplicationConfig } from "../config/types"

class VeeDriveService extends NetworkFileBrowsingServiceBase {
  private veeDriveConfig
  protected readonly communicationAdapter

  constructor(private config: ApplicationConfig) {
    super()
    this.veeDriveConfig = {
      ...VeeDriveConfig,
      hostname: config.VEEDRIVE_WS_PATH,
    }
    this.communicationAdapter = new WebsocketAdapter(
      this.veeDriveConfig.hostname
    )
  }

  public readonly listDirectory = async (
    params: VeeDriveListDirectoryRequest
  ): Promise<VeeDriveListDirectoryResponse> =>
    this.sendRequest(this.veeDriveConfig.endpointNames.listDirectory, params)

  public readonly requestFile = async (
    params: VeeDriveFileRequest
  ): Promise<VeeDriveFileResponse> =>
    this.sendRequest(this.veeDriveConfig.endpointNames.requestFile, params)

  public readonly requestImage = async (
    params: VeeDriveImageRequest
  ): Promise<VeeDriveImageResponse> =>
    this.sendRequest(this.veeDriveConfig.endpointNames.requestImage, params)

  public async *searchFileSystem(
    params: VeeDriveSearchFileSystemRequest
  ): AsyncIterableIterator<SearchFileSystemResponse> {
    console.debug("Send search request", params)
    const searchResponse: VeeDriveSearchFileSystemResponse = await this.sendRequest(
      this.veeDriveConfig.endpointNames.searchFiles,
      params
    )
    const searchId = searchResponse.searchId
    console.debug("Got searchId", searchId)
    while (true) {
      console.debug("Fetch results for", searchId)
      const currentResults: SearchFileSystemResponse = await this.sendRequest(
        this.veeDriveConfig.endpointNames.searchResults,
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
    this.sendRequest(this.veeDriveConfig.endpointNames.savePresentation, store)

  public readonly listPresentations = async (): Promise<VeeDriveListPresentationsResponse> =>
    this.sendRequest(this.veeDriveConfig.endpointNames.listPresentations)

  public readonly getPresentation = async (
    id: string
  ): Promise<SpectaclePresentation> =>
    this.sendRequest(this.veeDriveConfig.endpointNames.getPresentation, { id })
}

export default VeeDriveService
