import queryParamOverrides from "./query-param-overrides"
import { ApplicationConfig } from "./types"

declare const ENV_VARIABLES: any

console.debug("ENV_VARIABLES", ENV_VARIABLES)

const viewportWidth = window.visualViewport.width
const viewportHeight = window.visualViewport.height
const viewportLongSide = Math.max(viewportWidth, viewportHeight)
const viewportShortSide = Math.min(viewportWidth, viewportHeight)

let config: ApplicationConfig = {
  VIEWPORT_WIDTH: viewportWidth,
  VIEWPORT_HEIGHT: viewportHeight,
  VEEDRIVE_WS_PATH: "ws://localhost:4444/ws",
  FILE_BROWSER_WIDTH: 500,
  FILE_BROWSER_HEIGHT: 400,
  MINIMUM_FRAME_LONG_SIDE: viewportLongSide / 5,
  MAXIMUM_FRAME_LONG_SIDE: Math.min(
    viewportLongSide * 0.8,
    viewportShortSide * 0.95
  ),
  ALLOW_SCALE_WITH_MOUSEWHEEL: true,
  ALLOW_MAX_LAUNCHER_MENUS: 1,
  DISPLAY_MOUSE_CURSOR: true,
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
