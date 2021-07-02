import WebsocketAdapter, { PendingRequest } from "./websocket"
import { JsonRPCRequest } from "../json-rpc"
// tslint:disable-next-line:no-implicit-dependencies
import WS from "jest-websocket-mock"

let adapter: WebsocketAdapter

beforeEach(() => {
  adapter = new WebsocketAdapter("myhost")
  jest
    .spyOn<any, any>(adapter, "getWebsocketConnection")
    .mockImplementation(() =>
      Promise.resolve({
        readyState: WebSocket.OPEN,
        send: async () => Promise.resolve(new JsonRPCRequest("test")),
      })
    )
})

afterEach(() => {
  jest.clearAllMocks()
})

test("check basic API setup", () => {
  expect(adapter.hostname).toEqual("myhost")
})

test("send mock request", async () => {
  jest.spyOn<any, any>(adapter, "getNewPendingRequest").mockImplementation(
    (
      request: JsonRPCRequest,
      resolve: Function,
      reject: Function
    ): PendingRequest => {
      resolve("Hi!")
      return new PendingRequest(request, resolve, reject)
    }
  )

  const response = await adapter.sendRequest("test")

  expect(response).toEqual("Hi!")
})

const testWebsocketHost = "ws://localhost:12345"

test("get websocket connection", async () => {
  jest.clearAllMocks()
  const server = new WS(testWebsocketHost)
  adapter = new WebsocketAdapter(testWebsocketHost)

  expect(adapter.isConnected()).toBeFalsy()

  await adapter.connect()

  expect(adapter.isConnected()).toBeTruthy()
  expect(() => server.error()).toThrow()

  const connection = await adapter.connect()
  expect(connection).toBeDefined()

  const request = adapter.sendRequest("someMethod", null, "123")
  expect(request).resolves.toEqual("OK")

  expect(() => server.send(`{"id": "12345", "result": "OK"}`)).toThrow(
    new Error("Request 12345 does not exist in the queue.")
  )

  server.close()
  expect(adapter.isConnected()).toBeFalsy()
})

test("handle incoming messages", () => {
  const eventRawDataWrongFormat = `{"result": "This object is missing id"}`
  const messageEventWrongFormat = new MessageEvent("mock", {
    data: eventRawDataWrongFormat,
  })
  const eventRawData = `{"id": 123, "result": "OK"}`
  const messageEvent = new MessageEvent("mock", { data: eventRawData })

  expect(messageEventWrongFormat.data).toEqual(eventRawDataWrongFormat)

  expect(messageEvent.data).toEqual(eventRawData)

  expect(() => adapter.handleNewMessage(messageEvent.data)).toThrow(
    new Error("Request 123 does not exist in the queue.")
  )

  const rpcRequest = new JsonRPCRequest("testMethod")
  const pendingRequest = new PendingRequest(
    rpcRequest,
    () => "XX",
    () => {
      return
    }
  )

  jest.spyOn<any, any>(pendingRequest, "resolve")
  jest.spyOn<any, any>(adapter, "removeFromQueue")
  jest
    .spyOn<any, any>(adapter, "getFromQueue")
    .mockImplementation((requestId: string) => pendingRequest)

  expect(adapter.handleNewMessage(messageEvent.data)).toBeUndefined()

  expect(pendingRequest.resolve).toHaveBeenCalled()
})
