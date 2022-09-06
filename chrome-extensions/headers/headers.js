console.info("Header Remover extension loaded")

const HEADERS_TO_REMOVE = [
  "content-security-policy",
  "x-frame-options",
  "referrer-policy",
]

chrome.webRequest.onHeadersReceived.addListener(
  details => {
    console.debug("removing headers", details)
    return {
      responseHeaders: details.responseHeaders.filter(
        header => !HEADERS_TO_REMOVE.includes(header.name.toLowerCase())
      ),
    }
  },
  {
    urls: ["<all_urls>"],
  },
  ["blocking", "responseHeaders", "extraHeaders"]
)