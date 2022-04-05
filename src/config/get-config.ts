import { globalConfig } from "./index"
import { ApplicationConfig } from "./types"

const getConfig = (): ApplicationConfig => {
  return globalConfig
}

export default getConfig
