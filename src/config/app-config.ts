import queryParamOverrides from "./query-param-overrides"
import { ApplicationConfig, RunningEnvironment } from "./types"

const viewportWidth = window.visualViewport?.width
const viewportHeight = window.visualViewport?.height
const viewportLongSide = Math.max(viewportWidth, viewportHeight) || 3600
const viewportShortSide = Math.min(viewportWidth, viewportHeight) || 1200

declare const ENV_VARIABLES: any

let defaultConfig: ApplicationConfig = {
  RUNNING_ENVIRONMENT:
    ENV_VARIABLES.SPECTACLE_RUNNING_ENVIRONMENT ?? RunningEnvironment.CLIENT,
  VERSION: ENV_VARIABLES.SPECTACLE_VERSION,
  REVISION: ENV_VARIABLES.SPECTACLE_REVISION,
  SENTRY_DSN:
    "https://a091d41e9df94ce787371864e96e7301@o224246.ingest.sentry.io/6367583",
  SENTRY_EXCLUDE_ENVIRONMENTS: [RunningEnvironment.DEV],
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
  FULLSCREEN_TRANSITION_MS: 500,
  TOUCH_HOLD_DURATION_MS: 200,
  IMAGE_KEEPER_SINGLE_WORKER: true,
  LOAD_IMAGES_AS_CSS_BACKGROUND: true,
}

defaultConfig = {
  ...defaultConfig,
  FILE_BROWSER_WIDTH: Math.max(defaultConfig.VIEWPORT_WIDTH / 3, 800),
  FILE_BROWSER_HEIGHT: Math.max(defaultConfig.VIEWPORT_HEIGHT / 2.5, 600),
}

const config: ApplicationConfig = queryParamOverrides.wrap(defaultConfig)

export default config
