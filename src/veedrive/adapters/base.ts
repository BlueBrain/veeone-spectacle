export default abstract class CommunicationAdapterBase {
    abstract sendRequest(method: string, params?: any): Promise<any>

    abstract connect(): Promise<any>
}
