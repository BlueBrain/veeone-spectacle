import {
    VeeDriveFileRequest,
    VeeDriveFileResponse,
    VeeDriveImageRequest,
    VeeDriveImageResponse,
    VeeDriveListDirectoryRequest,
    VeeDriveListDirectoryResponse
} from "./types"
import WebsocketAdapter from "./adapters"
import NetworkFileBrowsingServiceBase from "./base-service"
import VeeDriveConfig from "./config"


class VeeDriveService extends NetworkFileBrowsingServiceBase {
    protected readonly communicationAdapter = new WebsocketAdapter(VeeDriveConfig.hostname)

    public readonly listDirectory = async (params: VeeDriveListDirectoryRequest): Promise<VeeDriveListDirectoryResponse> =>
        this.sendRequest(VeeDriveConfig.endpointNames.listDirectory, params)

    public readonly requestFile = async (params: VeeDriveFileRequest): Promise<VeeDriveFileResponse> =>
        this.sendRequest(VeeDriveConfig.endpointNames.requestFile, params)

    public readonly requestImage = async (params: VeeDriveImageRequest): Promise<VeeDriveImageResponse> =>
        this.sendRequest(VeeDriveConfig.endpointNames.requestImage, params)
}

export default new VeeDriveService()
