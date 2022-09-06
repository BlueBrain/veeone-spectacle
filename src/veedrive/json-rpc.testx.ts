import { JsonRPCResponse } from "./json-rpc"

it("should throw errors on wrong format", () => {
  expect(() => {
    JsonRPCResponse.createFromString(`Some random string`)
  }).toThrow()

  expect(() => {
    JsonRPCResponse.createFromString(`{"error": "Some message"}`)
  }).toThrow()

  expect(() => {
    JsonRPCResponse.createFromString(`null`)
  }).toThrow()
})
