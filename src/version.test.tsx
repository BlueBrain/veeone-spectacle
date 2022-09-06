import { getConfig } from "./config"

describe("Version test", () => {
  it("should return a version", () => {
    const config = getConfig()
    expect(config.VERSION).toEqual("test.test.test")
    expect(config.REVISION).toEqual("abcdefgh")
  })
})
