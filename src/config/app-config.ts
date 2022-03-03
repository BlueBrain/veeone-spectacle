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
  LAUNCHER_MENU_SIZE: Math.max(0.3 * viewportHeight, 350),
  VEEDRIVE_WS_PATH: "wss://bbpcd013.bbp.epfl.ch:8080/ws",
  FILE_BROWSER_WIDTH: 500,
  FILE_BROWSER_HEIGHT: 400,
  MINIMUM_FRAME_LONG_SIDE: Math.max(viewportLongSide / 12, 200),
  MAXIMUM_FRAME_LONG_SIDE: Math.min(
    viewportLongSide * 0.8,
    viewportShortSide * 0.95
  ),
  ALLOW_SCALE_WITH_MOUSEWHEEL: true,
  ALLOW_MAX_LAUNCHER_MENUS: 1,
  DISPLAY_MOUSE_CURSOR: true,
  DEFAULT_NEW_FRAME_WIDTH: 300,
  DEFAULT_NEW_FRAME_HEIGHT: 300,
  FILE_BROWSER_OPEN_MEDIA_OFFSET: 20,
  FILE_BROWSER_OPEN_MEDIA_CASCADE_OFFSET_X: 40,
  FILE_BROWSER_OPEN_MEDIA_CASCADE_OFFSET_Y: 20,
  FILE_BROWSER_OPEN_MEDIA_CASCADE_MAX_PER_ROW: 10,
  FILE_BROWSER_OPEN_MEDIA_CASCADE_DELAY_MS: 100,
}

config = {
  ...config,
  VEEDRIVE_WS_PATH:
    ENV_VARIABLES.SPECTACLE_VEEDRIVE_WS_PATH ?? config.VEEDRIVE_WS_PATH,
}

config = {
  ...config,
  FILE_BROWSER_WIDTH: Math.max(config.VIEWPORT_WIDTH / 3, 600),
  FILE_BROWSER_HEIGHT: Math.max(config.VIEWPORT_HEIGHT / 2.5, 400),
}

const AppConfigWithOverrides: ApplicationConfig = queryParamOverrides.wrap(
  config
)

console.debug("AppConfigWithOverrides", AppConfigWithOverrides)

export default AppConfigWithOverrides
