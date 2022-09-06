import makeEllipsis, { EllipsisPosition } from "./makeEllipsis"

describe("makeEllipsis", () => {
  it("should return original string if length is less than max", () => {
    expect(makeEllipsis("do nothing with this text")).toEqual(
      "do nothing with this text"
    )
    expect(makeEllipsis("lorem", { visibleCharacters: 20 })).toEqual("lorem")
  })

  it("should make an ellipsis", () => {
    const text = "This is just a sample text to test things out."
    expect(
      makeEllipsis(text, {
        ellipsisPosition: EllipsisPosition.START,
        visibleCharacters: 10,
      })
    ).toEqual("…hings out.")

    expect(
      makeEllipsis(text, {
        ellipsisPosition: EllipsisPosition.END,
        visibleCharacters: 10,
      })
    ).toEqual("This is ju…")

    expect(
      makeEllipsis(text, {
        ellipsisPosition: EllipsisPosition.MIDDLE,
        visibleCharacters: 10,
      })
    ).toEqual("This … out.")

    expect(
      makeEllipsis("12345678901234567890", {
        ellipsisPosition: EllipsisPosition.MIDDLE,
        visibleCharacters: 10,
        tolerance: 2,
      })
    ).toEqual("12345…67890")

    expect(
      makeEllipsis("123456789012", {
        ellipsisPosition: EllipsisPosition.MIDDLE,
        visibleCharacters: 10,
        tolerance: 2,
      })
    ).toEqual("123456789012")
  })
})
