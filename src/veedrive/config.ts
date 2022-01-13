import { config } from "../config"

const VeeDriveConfig = {
  hostname: config.VEEDRIVE_WS_PATH,
  endpointNames: {
    listDirectory: "ListDirectory",
    requestFile: "RequestFile",
    requestImage: "RequestImage",
    searchFiles: "Search",
    searchResults: "SearchResult",
    savePresentation: "SavePresentation",
    listPresentations: "ListPresentations",
    getPresentation: "GetPresentation",
  },
  minSearchQueryLength: 3,
}

export default VeeDriveConfig
