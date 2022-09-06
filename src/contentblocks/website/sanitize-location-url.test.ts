import sanitizeLocationUrl from "./sanitize-location-url"

describe("sanitizeLocationUrl", () => {
  it("should pass valid URLs", () => {
    expect(sanitizeLocationUrl("https://epfl.ch/")).toEqual("https://epfl.ch/")
  })

  it("should append https before the address", () => {
    expect(sanitizeLocationUrl("epfl.ch")).toEqual("https://epfl.ch")
    expect(sanitizeLocationUrl("bbp.epfl.ch")).toEqual("https://bbp.epfl.ch")
    expect(sanitizeLocationUrl("www.google.com")).toEqual(
      "https://www.google.com"
    )
  })
})
