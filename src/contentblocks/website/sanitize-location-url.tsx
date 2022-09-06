const sanitizeLocationUrl = (value: string) => {
  let url: URL
  let urlString: string = ""
  try {
    url = new URL(value)
    urlString = url.href
  } catch (error) {
    if (!value.startsWith("https://") && !value.startsWith("http://")) {
      urlString = `https://${value}`
    } else {
      urlString = "https://epfl.ch"
    }
  }

  return urlString
}

export default sanitizeLocationUrl
