const VeeDriveConfig = {
  hostname: `ws://localhost:4444/ws`,
  endpointNames: {
    listDirectory: "ListDirectory",
    requestFile: "RequestFile",
    requestImage: "RequestImage",
    searchFiles: "Search",
  },
  minSearchQueryLength: 3,
}

export default VeeDriveConfig
