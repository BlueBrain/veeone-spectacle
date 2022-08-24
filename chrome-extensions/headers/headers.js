const HEADERS_TO_REMOVE = ["content-security-policy", "x-frame-options"]

chrome.webRequest.onHeadersReceived.addListener(
  details => ({
    responseHeaders: details.responseHeaders.filter(
      header => !HEADERS_TO_REMOVE.includes(header.name.toLowerCase())
    ),
  }),
  {
    urls: ["<all_urls>"],
  },
  ["blocking", "responseHeaders", "extraHeaders"]
)
