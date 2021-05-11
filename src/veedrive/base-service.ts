import CommunicationAdapterBase from "./adapters/base"

export default class BaseService {
    protected readonly communicationAdapter: CommunicationAdapterBase

    protected readonly sendRequest = async (method: string, params: any) =>
        this.communicationAdapter.sendRequest(method, params)

    public readonly connect = async () => this.communicationAdapter.connect()
}
