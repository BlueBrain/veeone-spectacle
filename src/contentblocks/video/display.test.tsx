import { friendlyFormatTime } from "./display"

describe("friendlyFormatTime", () => {
  it("should display minutes and seconds", () => {
    expect(friendlyFormatTime(0.5)).toEqual("00:00")
    expect(friendlyFormatTime(0)).toEqual("00:00")
    expect(friendlyFormatTime(1)).toEqual("00:01")
    expect(friendlyFormatTime(15)).toEqual("00:15")
    expect(friendlyFormatTime(90)).toEqual("01:30")
    expect(friendlyFormatTime(3685)).toEqual("1:01:25")
    expect(friendlyFormatTime(24 * 3600 + 35 * 60)).toEqual("24:35:00")
  })
})
