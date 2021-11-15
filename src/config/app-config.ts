import queryParamOverrides from "./query-param-overrides"
import { ApplicationConfig } from "./types"

declare const ENV_VARIABLES: any

console.debug("ENV_VARIABLES", ENV_VARIABLES)

const defaults = {
  VEEDRIVE_WS_PATH: "ws://localhost:4444/ws",
}

const AppConfig: ApplicationConfig = {
  VEEDRIVE_WS_PATH:
    ENV_VARIABLES.SPECTACLE_VEEDRIVE_WS_PATH ?? defaults.VEEDRIVE_WS_PATH,
  FILE_BROWSER_WIDTH: 700,
  FILE_BROWSER_HEIGHT: 400,
}

const AppConfigWithOverrides = queryParamOverrides.wrap(AppConfig)

console.debug("AppConfigWithOverrides", AppConfigWithOverrides)

export default AppConfigWithOverrides
