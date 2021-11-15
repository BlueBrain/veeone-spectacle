import queryParamOverrides from "./query-param-overrides"
import { ApplicationConfig } from "./types"

declare const ENV_VARIABLES: any

console.debug("ENV_VARIABLES", ENV_VARIABLES)

const defaults = {
  VIEWPORT_WIDTH: window.visualViewport.width,
  VIEWPORT_HEIGHT: window.visualViewport.height,
  VEEDRIVE_WS_PATH: "ws://localhost:4444/ws",
  FILE_BROWSER_WIDTH: window.visualViewport.width / 3,
  FILE_BROWSER_HEIGHT: window.visualViewport.height / 3,
}

const AppConfig: ApplicationConfig = {
  ...defaults,
  VEEDRIVE_WS_PATH:
    ENV_VARIABLES.SPECTACLE_VEEDRIVE_WS_PATH ?? defaults.VEEDRIVE_WS_PATH,
  VIEWPORT_WIDTH: window.visualViewport.width,
  VIEWPORT_HEIGHT: window.visualViewport.height,
}

const AppConfigWithOverrides = queryParamOverrides.wrap(AppConfig)

console.debug("AppConfigWithOverrides", AppConfigWithOverrides)

export default AppConfigWithOverrides
