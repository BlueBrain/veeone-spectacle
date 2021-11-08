import { v4 as uuid4 } from "uuid"
import { Json } from "../common/types"

export class JsonRPCRequest {
  readonly jsonrpc = "2.0"
  readonly id: string

  static readonly generateRequestId = (): string => uuid4()

  constructor(
    public readonly method: string,
    public readonly params?: Json,
    id?: string
  ) {
    const uuidStr: string = JsonRPCRequest.generateRequestId()
    this.id = id ?? uuidStr
  }
}

interface JsonRPCResponseData {
  id: string
  result?: Json
  error?: Json
}

export class JsonRPCResponse {
  readonly jsonrpc = "2.0"

  constructor(
    public readonly id: string,
    public readonly result?: Json,
    public readonly error?: Json
  ) {}

  static readonly validateJsonRPCResponseFormat = (
    data: JsonRPCResponseData
  ) => {
    const id = "id" in data ? data.id : undefined
    const result = "result" in data ? data.result : undefined
    const error = "error" in data ? data.error : undefined
    if (
      typeof id === "undefined" ||
      (typeof result === "undefined" && typeof error === "undefined") ||
      (typeof error !== "undefined" && typeof result !== "undefined")
    ) {
      throw new Error(`Cannot create JsonRPCResponse. Invalid format.`)
    }
    return { id, result, error }
  }

  static readonly createFromString = (data: string): JsonRPCResponse => {
    // TODO wrap in try..catch.. with custom exception
    const jsonData: JsonRPCResponseData = JSON.parse(
      data
    ) as JsonRPCResponseData
    const { id, result, error } = JsonRPCResponse.validateJsonRPCResponseFormat(
      jsonData
    )
    return new JsonRPCResponse(id, result, error)
  }
}
