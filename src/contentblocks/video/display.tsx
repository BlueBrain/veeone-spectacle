import { padStart } from "lodash"

export function friendlyFormatTime(totalSeconds: number) {
  const seconds = Math.floor(totalSeconds % 60)
  const remainingSeconds = totalSeconds - seconds
  const minutes = Math.floor((remainingSeconds / 60) % 60)
  const hours = Math.floor(remainingSeconds / 60 / 60)
  const padMinutes = padStart(`${minutes}`, 2, "0")
  const padSeconds = padStart(`${seconds}`, 2, "0")
  let result = `${padMinutes}:${padSeconds}`
  if (hours !== 0) {
    result = `${hours}:${result}`
  }
  return result
}
