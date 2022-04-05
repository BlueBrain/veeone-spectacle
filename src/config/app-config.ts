import queryParamOverrides from "./query-param-overrides"
import { ApplicationConfig } from "./types"

const viewportWidth = window.visualViewport?.width
const viewportHeight = window.visualViewport?.height
const viewportLongSide = Math.max(viewportWidth, viewportHeight) || 3600
const viewportShortSide = Math.min(viewportWidth, viewportHeight) || 1200

let defaultConfig: ApplicationConfig = {
  VIEWPORT_WIDTH: viewportWidth,
  VIEWPORT_HEIGHT: viewportHeight,
  LAUNCHER_MENU_SIZE: "22.5rem",
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

defaultConfig = {
  ...defaultConfig,
  FILE_BROWSER_WIDTH: Math.max(defaultConfig.VIEWPORT_WIDTH / 3, 800),
  FILE_BROWSER_HEIGHT: Math.max(defaultConfig.VIEWPORT_HEIGHT / 2.5, 600),
}

const config: ApplicationConfig = queryParamOverrides.wrap(defaultConfig)

export default config
