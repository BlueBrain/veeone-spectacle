import CommunicationAdapterBase from "./base"
import { JsonRPCRequest, JsonRPCResponse } from "../json-rpc"
import { delay } from "../../common/asynchronous"
import { Json } from "../../common/types"
import JSONRPCError from "../../errors/jsonrpcerror"

export class PendingRequest {
  constructor(
    public request: JsonRPCRequest,
    public resolve: Function,
    public reject: Function
  ) {}
}

export default class WebsocketAdapter implements CommunicationAdapterBase {
  private connection: WebSocket
  private readonly requestQueue = new Map<string, PendingRequest>()

  constructor(public readonly hostname: string) {}

  private readonly addToQueue = (pendingRequest: PendingRequest) =>
    this.requestQueue.set(pendingRequest.request.id, pendingRequest)

  private readonly removeFromQueue = (
    pendingRequest: PendingRequest
  ): boolean => this.requestQueue.delete(pendingRequest.request.id)

  private readonly getFromQueue = (requestId: string) =>
    this.requestQueue.get(requestId)

  private readonly sendWebsocketMessage = async (
    method: string,
    params?: Json,
    id?: string
  ): Promise<JsonRPCRequest> => {
    const websocketConnection = await this.getWebsocketConnection()
    const request: JsonRPCRequest = new JsonRPCRequest(method, params, id)
    websocketConnection.send(JSON.stringify(request))
    return request
  }

  private readonly getNewPendingRequest = (
    request: JsonRPCRequest,
    resolve: Function,
    reject: Function
  ): PendingRequest => new PendingRequest(request, resolve, reject)

  private readonly getWebsocketConnection = async (): Promise<WebSocket> => {
    if (this.isConnected()) {
      return Promise.resolve(this.connection)
    }

    return new Promise<WebSocket>((resolve, reject) => {
      this.connection = new WebSocket(this.hostname, [])
      this.connection.binaryType = "arraybuffer"
      this.connection.addEventListener("open", () => resolve(this.connection))
      this.connection.addEventListener(
        "message",
        (messageEvent: MessageEvent) =>
          this.handleNewMessage(messageEvent.data as string)
      )
      this.connection.addEventListener("error", error => {
        throw error
      })
      this.connection.addEventListener("close", (event: CloseEvent) => {
        throw new Error(
          `Websocket connection to ${this.hostname} has been closed. Reason ${event.reason}, ${event.code}`
        )
      })
    })
  }

  public readonly handleNewMessage = (eventData: string) => {
    const response: JsonRPCResponse = JsonRPCResponse.createFromString(
      eventData
    )
    const pendingRequest = this.getFromQueue(response.id)
    if (!pendingRequest) {
      throw new Error(`Request ${response.id} does not exist in the queue.`)
    }

    if (response.error) {
      pendingRequest.reject(new JSONRPCError(pendingRequest, response))
      // throw new JSONRPCError(pendingRequest, response)
    }

    pendingRequest.resolve(response.result)
    this.removeFromQueue(pendingRequest)
  }

  public readonly connect = async () => await this.getWebsocketConnection()

  public readonly isConnected = () =>
    this.connection && this.connection.readyState === WebSocket.OPEN

  public readonly sendRequest = async (
    method: string,
    params?: Json,
    id?: string
  ): Promise<any> => {
    // eslint-disable-next-line no-async-promise-executor
    const connectedPromise = new Promise(async (resolve, reject) => {
      await this.connect()
      // todo some timeout limits
      for (let i = 0; i < 100; i++) {
        if (this.connection.readyState) {
          resolve(this.connection)
          break
        }
        await delay(500)
      }
    })
    await connectedPromise
    return new Promise(async (resolve, reject) => {
      const request = await this.sendWebsocketMessage(method, params, id)
      this.addToQueue(this.getNewPendingRequest(request, resolve, reject))
    })
  }
}
