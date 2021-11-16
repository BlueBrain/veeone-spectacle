import queryParamOverrides from "./query-param-overrides"
import { ApplicationConfig } from "./types"

declare const ENV_VARIABLES: any

console.debug("ENV_VARIABLES", ENV_VARIABLES)

let config: ApplicationConfig = {
  VIEWPORT_WIDTH: window.visualViewport.width,
  VIEWPORT_HEIGHT: window.visualViewport.height,
  VEEDRIVE_WS_PATH: "ws://localhost:4444/ws",
  FILE_BROWSER_WIDTH: 500,
  FILE_BROWSER_HEIGHT: 400,
}

config = {
  ...config,
  VEEDRIVE_WS_PATH:
    ENV_VARIABLES.SPECTACLE_VEEDRIVE_WS_PATH ?? config.VEEDRIVE_WS_PATH,
}

config = {
  ...config,
  FILE_BROWSER_WIDTH: config.VIEWPORT_WIDTH / 1.5,
  FILE_BROWSER_HEIGHT: config.VIEWPORT_HEIGHT / 1.5,
}

const AppConfigWithOverrides: ApplicationConfig = queryParamOverrides.wrap(
  config
)

console.debug("AppConfigWithOverrides", AppConfigWithOverrides)

export default AppConfigWithOverrides
