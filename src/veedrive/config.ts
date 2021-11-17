import { config } from "../config"

const VeeDriveConfig = {
  hostname: config.VEEDRIVE_WS_PATH,
  endpointNames: {
    listDirectory: "ListDirectory",
    requestFile: "RequestFile",
    requestImage: "RequestImage",
    searchFiles: "Search",
    searchResults: "SearchResult",
  },
  minSearchQueryLength: 3,
}

export default VeeDriveConfig
