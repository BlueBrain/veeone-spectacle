import CommunicationAdapterBase from "./adapters/base"
import WebsocketAdapter from "./adapters"
import { VeeDriveHealthCheckResponse } from "./types"

class VeeDriveHealthCheckService {
  protected readonly communicationAdapter: CommunicationAdapterBase
  private readonly endpointNames = {
    checkHealth: "HealthCheck",
  }

  constructor(private wsPath: string) {
    this.communicationAdapter = new WebsocketAdapter(this.wsPath)
  }

  protected readonly sendRequest = async (method: string, params?: any) =>
    this.communicationAdapter.sendRequest(method, params)

  public readonly connect = async () => this.communicationAdapter.connect()

  public readonly checkHealth = async (): Promise<VeeDriveHealthCheckResponse> =>
    this.sendRequest(this.endpointNames.checkHealth)
}

export default VeeDriveHealthCheckService
