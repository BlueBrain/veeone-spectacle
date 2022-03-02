export enum EllipsisPosition {
  START,
  MIDDLE,
  END,
}

interface EllipsisOptions {
  visibleCharacters?: number
  ellipsisPosition?: EllipsisPosition
  ellipsisChar?: string
  tolerance?: number
}

const makeEllipsis = (
  text: string,
  {
    visibleCharacters,
    ellipsisPosition = EllipsisPosition.MIDDLE,
    ellipsisChar = "…",
    tolerance = 2,
  }: EllipsisOptions = {}
): string => {
  if (
    visibleCharacters === undefined ||
    text.length <= visibleCharacters + tolerance
  ) {
    return text
  }
  let result, startSlice, endSlice: string
  switch (ellipsisPosition) {
    case EllipsisPosition.START:
      result = `${ellipsisChar}${text.slice(text.length - visibleCharacters)}`
      break
    case EllipsisPosition.END:
      result = `${text.slice(0, visibleCharacters)}${ellipsisChar}`
      break
    default:
      startSlice = text.slice(0, visibleCharacters / 2)
      endSlice = text.slice(text.length - visibleCharacters / 2)
      result = `${startSlice}${ellipsisChar}${endSlice}`
      break
  }
  return result
}

export default makeEllipsis
