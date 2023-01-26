import { JsonRPCRequest, JsonRPCResponse } from "../veedrive/json-rpc"

export default class JSONRPCError extends Error {
  request: JsonRPCRequest
  response: JsonRPCResponse

  constructor(pendingRequest, response, ...params) {
    super(...params)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, JSONRPCError)
    }
    this.name = "JSONRPCError"
    this.message = JSON.stringify(response.error)
    this.request = pendingRequest
    this.response = response
  }
}
