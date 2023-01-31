class QueryParamOverrideService {
  wrap(conf) {
    return {
      ...conf,
      ...this.getQueryParamSettings(),
    }
  }

  getQueryParamSettings() {
    const queryParams = new URLSearchParams(window.location.search)
    let paramsObject = {}
    let confParamValue
    if (queryParams.has("conf")) {
      confParamValue = queryParams.get("conf")
      try {
        paramsObject = JSON.parse(confParamValue)
      } catch (e) {}
    }
    return paramsObject
  }
}

const queryParamOverrides = new QueryParamOverrideService()

export default queryParamOverrides
