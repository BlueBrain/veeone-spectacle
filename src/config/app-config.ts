import queryParamOverrides from "./query-param-overrides"
import { ApplicationConfig } from "./types"

declare const ENV_VARIABLES: any

console.debug("ENV_VARIABLES", ENV_VARIABLES)

const viewPortWidth = window.visualViewport.width
const viewPortHeight = window.visualViewport.height
const viewPortLongSide =
  viewPortWidth > viewPortHeight ? viewPortWidth : viewPortHeight

let config: ApplicationConfig = {
  VIEWPORT_WIDTH: viewPortWidth,
  VIEWPORT_HEIGHT: viewPortHeight,
  VEEDRIVE_WS_PATH: "ws://localhost:4444/ws",
  FILE_BROWSER_WIDTH: 500,
  FILE_BROWSER_HEIGHT: 400,
  MINIMUM_FRAME_LONG_SIDE: viewPortLongSide / 5,
  MAXIMUM_FRAME_LONG_SIDE: viewPortLongSide * 0.8,
  ALLOW_SCALE_WITH_MOUSEWHEEL: true,
}

config = {
  ...config,
  VEEDRIVE_WS_PATH:
    ENV_VARIABLES.SPECTACLE_VEEDRIVE_WS_PATH ?? config.VEEDRIVE_WS_PATH,
}

config = {
  ...config,
  FILE_BROWSER_WIDTH: config.VIEWPORT_WIDTH / 3,
  FILE_BROWSER_HEIGHT: config.VIEWPORT_HEIGHT / 2.5,
}

const AppConfigWithOverrides: ApplicationConfig = queryParamOverrides.wrap(
  config
)

console.debug("AppConfigWithOverrides", AppConfigWithOverrides)

export default AppConfigWithOverrides
