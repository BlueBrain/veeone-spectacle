import { globalConfig } from "./index"
import { ApplicationConfig } from "./types"

const getConfig = (): ApplicationConfig => {
  return globalConfig
}

console.debug("globalConfig=", globalConfig)

export default getConfig
